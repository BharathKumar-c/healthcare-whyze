import { aws_iam } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';
import { envSpecific, getDeployEnv } from './util';
import { join } from 'path';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Queue } from 'aws-cdk-lib/aws-sqs';

interface WhyzeEcsProps {
  whyzeVPC: ec2.Vpc;
  bucket: Bucket;
  hcpQueue: Queue;
}
export class WhyzeHcpEcs extends Construct {
  constructor(scope: Construct, id: string, props: WhyzeEcsProps) {
    super(scope, id);

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, envSpecific('hcp_api_cluster'), {
      clusterName: envSpecific('hcp_api'),
      vpc: props.whyzeVPC,
    });

    const logGroup = new logs.LogGroup(this, envSpecific('hcp_api_logs'), {
      logGroupName: envSpecific('hcp_api_log_group'),
    });

    const ENV = require(`../env.${getDeployEnv()}.json`);

    const hcpApp = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      envSpecific('hcp_api'),
      {
        cluster,
        desiredCount: 1,
        memoryLimitMiB: 1024,
        cpu: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(join(__dirname, `../../`), {
            exclude: ['infra/*', '.git/*'],
          }),
          environment: {
            ...ENV,
            S3_BUCKET: props.bucket.bucketName,
            APP_ENV: getDeployEnv() || 'dev',
          },
          logDriver: new ecs.AwsLogDriver({
            logGroup,
            streamPrefix: envSpecific('hcp-api-stream'),
            multilinePattern: '^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}Z.*$',
            mode: ecs.AwsLogDriverMode.NON_BLOCKING,
          }),
        },
      },
    );

    hcpApp.taskDefinition.addToTaskRolePolicy(
      new aws_iam.PolicyStatement({
        actions: [
          'ses:SendEmail',
          'SES:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: ['*'],
        effect: aws_iam.Effect.ALLOW,
      }),
    );

    const smsStatement = new aws_iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: ['*'],
    });

    // Add the SMS policy statement to the task role policy
    hcpApp.taskDefinition.addToTaskRolePolicy(smsStatement);

    hcpApp.taskDefinition.addToTaskRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [props.bucket.arnForObjects('*')],
        effect: aws_iam.Effect.ALLOW,
      }),
    );

    hcpApp.taskDefinition.defaultContainer?.addEnvironment(
      'SQS_QUEUE_URL',
      props.hcpQueue.queueUrl,
    );

    /**Health check */
    hcpApp.targetGroup.configureHealthCheck({ path: '/health' });

    hcpApp.service.autoScaleTaskCount({
      maxCapacity: 4,
      minCapacity: 1,
    });

    /*     new CfnOutput(this, envSpecific('hcp-patient-api'), {
      value: hcpApp.loadBalancer.loadBalancerName,
      exportName: envSpecific('hcp-api'),
    }); */
  }
}

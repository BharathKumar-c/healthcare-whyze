import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WhyzeHcpEcs } from './ecs';
import { getDeployEnv, envSpecific } from './util';
import { WhyzeVPC } from './vpc';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { aws_ec2, Duration } from 'aws-cdk-lib';
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';

export class WhyzeBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log({ DEPLOY_ENV: getDeployEnv() });

    // creating VPC
    const vpc = new WhyzeVPC(this, envSpecific('VPC'), {});

    const topicName = envSpecific('fesability');
    const region = this.region; // Get the region of the current stack
    const accountId = this.account; // Get the account of the current stack

    const topicArn = `arn:aws:sns:${region}:${accountId}:${topicName}`;

    const fesabilitySNSTopic = sns.Topic.fromTopicArn(
      this,
      envSpecific('fesability'),
      topicArn,
    );

    const hcpQueue = new sqs.Queue(this, envSpecific('hcp'), {
      queueName: envSpecific('hcp'),
    });

    fesabilitySNSTopic.addSubscription(
      new subscriptions.SqsSubscription(hcpQueue),
    );

    const bucket = new s3.Bucket(this, envSpecific('research-auth'), {
      bucketName: envSpecific('hcp-api-assets'),
    });

    // ECS for hcp_api
    new WhyzeHcpEcs(this, envSpecific('HcpApiEcsTask'), {
      whyzeVPC: vpc.whyzeVPC,
      bucket,
      hcpQueue,
    });

    const ENV = require(`../env.${getDeployEnv()}.json`);

    const lambdaSG = new aws_ec2.SecurityGroup(
      this,
      envSpecific('notificationCronLambdaSG'),
      {
        vpc: vpc.whyzeVPC,
      },
    );

    const nodeJsFunctionProps: lambda.FunctionProps = {
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(3),
      memorySize: 512,
      environment: {
        ...ENV,
        BUCKET_NAME: bucket.bucketName,
      },
      vpc: vpc.whyzeVPC,
      vpcSubnets: vpc.whyzeVPC.selectSubnets({
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
      securityGroups: [lambdaSG],
      architecture: lambda.Architecture.ARM_64,
      functionName: envSpecific('notification-cron'),
      handler: 'bundle.handler',
      code: Code.fromAsset('../cron_dist/'),
    };

    // notification lambda function
    const notificationFunction = new lambda.Function(
      this,
      envSpecific('notificationCronLambdaFunction'),
      nodeJsFunctionProps,
    );

    // Create the CloudWatch Events rule
    const rule = new events.Rule(this, envSpecific('NotificationCronRule'), {
      schedule: events.Schedule.cron({
        minute: '0/15', // Run every 15 minutes
        hour: '0-23', // Every hour of the day
        month: '*',
        day: '*',
        year: '*',
      }),
    });

    // Add the Lambda function as the target for the CloudWatch Events rule
    rule.addTarget(new targets.LambdaFunction(notificationFunction));
  }
}

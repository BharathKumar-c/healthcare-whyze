import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { envSpecific } from './util';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // S3
    const bucket = new s3.Bucket(this, envSpecific('whyze-research-portal'), {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      bucketName: envSpecific('whyze-research-portal-app'),
    });

    // Cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      envSpecific('Whyze-distribution'),
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            errorCachingMinTtl: 10,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
      },
    );

    // Deployment
    new s3Deploy.BucketDeployment(this, envSpecific('whyze-deployment'), {
      sources: [s3Deploy.Source.asset('../build')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // codepipeline

    /*     new CodePipeline(this, envSpecific('whyze-research-pipeline'), {
      pipelineName: envSpecific('whyze-research'),
      synth: new ShellStep(envSpecific('whyze-research-shell'), {
        input: CodePipelineSource.gitHub(
          'richarditero/whyze-research-web-app',
          'main',
        ),
        commands: ['npm ci', 'npm run build', 'npm run dev_deploy'],
      }),
    }); */
  }
}

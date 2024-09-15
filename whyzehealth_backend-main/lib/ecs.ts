import { CfnOutput } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";
import { envSpecific } from "./util";
import { join } from "path";

interface WhyzeEcsProps {
  whyzeVPC: ec2.Vpc;
}
export class WhyzeHcpEcs extends Construct {
  constructor(scope: Construct, id: string, props: WhyzeEcsProps) {
    super(scope, id);

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, envSpecific("hcp_api_cluster"), {
      clusterName: envSpecific("hcp_api"),
      vpc: props.whyzeVPC,
    });

    const hcpApp = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      envSpecific("hcp_api"),
      {
        cluster,
        desiredCount: 1,
        memoryLimitMiB: 1024,
        cpu: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(
            join(__dirname, `/../projects/hcp_api`)
          ),
          environment: {
            PORT: "80",
          },
        },
      }
    );

    hcpApp.targetGroup.configureHealthCheck({ path: "/health" });

    hcpApp.service.autoScaleTaskCount({
      maxCapacity: 4,
      minCapacity: 1,
    });

    new CfnOutput(this, envSpecific("hcp-patient-api"), {
      value: hcpApp.loadBalancer.loadBalancerName,
      exportName: envSpecific("hcp-api"),
    });
  }
}

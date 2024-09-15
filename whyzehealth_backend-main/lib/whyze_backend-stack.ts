import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { WhyzeApiGateway } from "./api_gateway";
import { WhyzeDatabase } from "./database";
import { WhyzeHcpEcs } from "./ecs";
import { WhyzeMicroservices } from "./microservice";
import { getDeployEnv, envSpecific } from "./util";
import { WhyzeVPC } from "./vpc";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class WhyzeBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log({ DEPLOY_ENV: getDeployEnv() });

    // creating VPC
    const vpc = new WhyzeVPC(this, envSpecific("VPC"), {});

    // databases
    /*     const db = new WhyzeDatabase(this, envSpecific("DB"), {
      whyzeVPC: vpc.whyzeVPC,
      stackId: id,
    });

    // Microservices for research app
    const microservices = new WhyzeMicroservices(
      this,
      envSpecific("Microservices"),
      {
        whyzeVPC: vpc.whyzeVPC,
        feasibilityDB: db.feasibilityDB,
        feasibilityDB_SG: db.feasibilityDB_SG,
        feasibilityDB_proxy: db.feasibilityDB_proxy,
        userTable: db.userTable,
      }
    );

    // API gateways
    new WhyzeApiGateway(this, envSpecific("ApiGateway"), {
      feasibilityMicroservice: microservices?.feasibilityFunction,
      authMicroservice: microservices?.authFunction,
    }); */

    // ECS for hcp_api
    new WhyzeHcpEcs(this, envSpecific("HcpApiEcsTask"), {
      whyzeVPC: vpc.whyzeVPC,
    });
  }
}

import { StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { envSpecific } from "./util";

export class WhyzeVPC extends Construct {
  public readonly whyzeVPC: Vpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id);

    this.whyzeVPC = this.createVpc();
  }

  private createVpc() {
    return new Vpc(this, envSpecific("WhyzeVpc"), {
      maxAzs: 2,
      vpcName: envSpecific("WhyzeVpc"),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: envSpecific("privatelambda"),
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: envSpecific("public"),
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });
  }
}

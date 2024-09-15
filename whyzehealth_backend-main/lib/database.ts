import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import { Port } from "aws-cdk-lib/aws-ec2";
import { envSpecific, getDeployEnv } from "./util";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";

interface WhyzeDBProps {
  whyzeVPC: ec2.Vpc;
  stackId: string;
}

export class WhyzeDatabase extends Construct {
  public feasibilityDB: rds.DatabaseInstance;
  public feasibilityDB_SG: ec2.SecurityGroup;
  public feasibilityDB_proxy: rds.DatabaseProxy;
  public userTable: ITable;

  constructor(scope: Construct, id: string, props: WhyzeDBProps) {
    super(scope, id);
    this.feasibilityDB = this.createFeasibilityDB(
      props.whyzeVPC,
      props.stackId
    );

    this.userTable = this.createUserTable();
  }

  private createFeasibilityDB(vpc: ec2.Vpc, stackId: string) {
    const dbSecurityGroup = new ec2.SecurityGroup(
      this,
      envSpecific("DbSecurityGroup"),
      {
        vpc,
      }
    );
    if (getDeployEnv() === "dev") {
      dbSecurityGroup.connections.allowFromAnyIpv4(
        Port.tcp(5432),
        "Development"
      );
    }

    this.feasibilityDB_SG = dbSecurityGroup;

    const databaseName = envSpecific("whyze_feasibility", "DB");

    const dbConfig: any = {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13,
      }),
      // optional, defaults to m5.large
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      /* vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }), */
      databaseName,
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      allocatedStorage: 25, // initial storage size
      maxAllocatedStorage: 200,
      deletionProtection: true,
      RemovalPolicy: RemovalPolicy.RETAIN,
    };

    if (getDeployEnv() === "dev") {
      dbConfig.publiclyAccessible = true;
      dbConfig.vpc = vpc;
      dbConfig.vpcSubnets = vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC,
      });
    } else {
      dbConfig.vpc = vpc;
      dbConfig.vpcSubnets = vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      });
    }

    const dbInstance = new rds.DatabaseInstance(
      this,
      envSpecific("Instance"),
      dbConfig
    );

    const dbProxyConfig: any = {
      proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
      secrets: [dbInstance.secret!],
      securityGroups: [dbSecurityGroup],
      vpc,
      requireTLS: false,
    };

    if (getDeployEnv() === "dev") {
      dbProxyConfig.vpcSubnets = vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      });
    } else {
      dbProxyConfig.vpcSubnets = vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC,
      });
    }

    const dbProxy = new rds.DatabaseProxy(
      this,
      envSpecific("Proxy"),
      dbProxyConfig
    );

    this.feasibilityDB_proxy = dbProxy;

    return dbInstance;
  }

  private createUserTable(): ITable {
    const userTable = new Table(this, envSpecific("user"), {
      partitionKey: {
        name: "email",
        type: AttributeType.STRING,
      },
      tableName: "whyze_research_app_user",
      removalPolicy: RemovalPolicy.RETAIN,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    return userTable;
  }
}

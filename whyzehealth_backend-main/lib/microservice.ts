import { aws_ec2, aws_iam, Duration, StackProps } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { DatabaseInstance, DatabaseProxy } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { join } from "path";
import { envSpecific } from "./util";

interface WhyzeMicroservicesProps {
  whyzeVPC: aws_ec2.Vpc;
  feasibilityDB: DatabaseInstance;
  feasibilityDB_SG: aws_ec2.SecurityGroup;
  feasibilityDB_proxy: DatabaseProxy;
  userTable: ITable;
}

export class WhyzeMicroservices extends Construct {
  public readonly feasibilityFunction: NodejsFunction;
  public readonly authFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: WhyzeMicroservicesProps) {
    super(scope, id);

    this.feasibilityFunction = this.createFeasibilityFunction(
      props.whyzeVPC,
      props.feasibilityDB,
      props.feasibilityDB_SG,
      props.feasibilityDB_proxy
    );

    this.authFunction = this.createAuthFunction(props.userTable);
  }

  private createFeasibilityFunction(
    vpc: aws_ec2.Vpc,
    dbInstance: DatabaseInstance,
    feasibilityDB_SG: aws_ec2.SecurityGroup,
    dbProxy: DatabaseProxy
  ): NodejsFunction {
    const lambdaSG = new aws_ec2.SecurityGroup(
      this,
      envSpecific("LambdaFeasibilitySG"),
      {
        vpc,
      }
    );

    feasibilityDB_SG.addIngressRule(
      lambdaSG,
      aws_ec2.Port.tcp(5432),
      "Lambda to Postgres database"
    );

    const databaseName = envSpecific("whyze_feasibility", "DB");

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk", "pg-native"],
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(3),
      memorySize: 256,
      environment: {
        DB_ENDPOINT_ADDRESS: dbProxy.endpoint,
        DB_NAME: databaseName,
        DB_SECRET_ARN: dbInstance.secret?.secretFullArn || "",
        REGION: "eu-west-1",
        RUNNING_ENV: "lambda",
      },
      vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
      securityGroups: [lambdaSG],
    };

    // feasibility microservices lambda function
    const feasibilityFunction = new NodejsFunction(
      this,
      envSpecific("feasibilityLambdaFunction"),
      {
        entry: join(__dirname, `/../projects/feasibility/lambda.js`),
        ...nodeJsFunctionProps,
      }
    );

    dbInstance.secret?.grantRead(feasibilityFunction);

    return feasibilityFunction;
  }

  private createAuthFunction(userTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      timeout: Duration.minutes(2),
      runtime: Runtime.NODEJS_16_X,
      memorySize: 256,
      environment: {
        PRIMARY_KEY: "id",
        USER_TABLE_NAME: userTable.tableName,
        JWT_SECRET_FOR_ACCESS_TOKEN: "ggiprvw364bf4-368rr4jw47846lwdjkefvkejvf",
        JWT_ISSUER: "whyze",
        JWT_SECRET_FOR_REFRESH_TOKEN: "89bdhueybdh3uyt3hbd654-835+83grhfgjbefj",
        JWT_SECRET_FOR_RESET_PASSWORD_TOKEN:
          "u8v37chvvevj*^3(efhvh65-+386dwgjwb",
        PORTAL_LINK: "https://dglvsajgaiuuc.cloudfront.net/",
        FORGOT_PASSWORD_ROUTE: "setup-password",
      },
    };

    // Auth microservices lambda function
    const authFunction = new NodejsFunction(
      this,
      envSpecific("authLambdaFunction"),
      {
        entry: join(__dirname, `/../projects/auth/lambda.js`),
        ...nodeJsFunctionProps,
      }
    );

    // ses permission
    authFunction.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: aws_iam.Effect.ALLOW,
      })
    );

    userTable.grantReadWriteData(authFunction);

    return authFunction;
  }
}

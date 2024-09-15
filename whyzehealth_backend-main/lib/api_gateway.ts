import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { envSpecific } from "./util";

interface WhyzeApiGatewayProps {
  feasibilityMicroservice: IFunction;
  authMicroservice: IFunction;
}

export class WhyzeApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: WhyzeApiGatewayProps) {
    super(scope, id);

    // feasibility api gateway
    this.createFeasibilityApi(props.feasibilityMicroservice);
    this.createAuthApi(props.authMicroservice);
  }

  private createFeasibilityApi(ms: IFunction) {
    const apigw = new LambdaRestApi(this, envSpecific("feasibilityApi"), {
      restApiName: "Feasibility Service",
      handler: ms,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    // apigw.root.addMethod('ANY');
  }

  private createAuthApi(ms: IFunction) {
    const apigw = new LambdaRestApi(this, envSpecific("authApi"), {
      restApiName: "Auth Service",
      handler: ms,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const register = apigw.root.addResource("register");
    register.addMethod("POST");

    const login = apigw.root.addResource("login");
    login.addMethod("POST");

    const refreshToken = apigw.root.addResource("refreshToken");
    refreshToken.addMethod("GET");

    const sendResetPasswordLink = apigw.root.addResource(
      "sendResetPasswordLink"
    );
    sendResetPasswordLink.addMethod("POST");

    const resetPassword = apigw.root.addResource("resetPassword");
    resetPassword.addMethod("POST");
  }
}

import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { IotToLambdaProps, IotToLambda } from '@aws-solutions-constructs/aws-iot-lambda';
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class IoTProcessingPipelineStack extends cdk.Stack {
  constructor(scope: any, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const iotFunction = new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../lambda/index.ts`),
      environment:{"POLICY_NAME":"jkshjdfgsjh"}
    });

    iotFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["iot:*"],
        resources: ["*"]
      })
    );

    const constructProps: IotToLambdaProps = {
      existingLambdaObj: iotFunction,
      iotTopicRuleProps: {
        topicRulePayload: {
          ruleDisabled: false,
          description:
            "Processing of DTC messages from the AWS Connected Vehicle Solution.",
          sql: "SELECT * FROM 'test/1'",
          actions: [],
        },
      },
    };

    new IotToLambda(this, 'test-iot-lambda-integration', constructProps);
  }
}

const app = new cdk.App();
new IoTProcessingPipelineStack(app, "IoTProcessingPipelineStack");

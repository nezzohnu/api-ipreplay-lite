import * as dynamoose from "dynamoose"
import settings from "config/settings"

const initDynamoose = () => {
  if (settings.use_dynamo_remote) {
    dynamoose.AWS.config.update({
      accessKeyId: settings.aws_access_key_id,
      secretAccessKey: settings.aws_secret_access_key,
      region: settings.aws_region,
    })
  } else {
    if (settings.isEnvTest) {
      dynamoose.local(settings.dynamo_local_test_url)
    } else {
      dynamoose.local(settings.dynamo_local_url)
    }
  }
}

if (!settings.use_amazon_serverless) { initDynamoose() }

const dynamo: any = dynamoose

export default dynamo

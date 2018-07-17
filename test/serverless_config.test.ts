import { getEnvVars } from "../serverless_config.js"

describe(__filename, () => {

  const params = {
    service: 'aws_serverless_service',
    accountId: '123',
    provider: {
      region: 'us-west-2',
      iamRoleStatements: {
        resourceDynamo: `arn:aws:dynamodb:us-west-2:*:*`,
        resourceSes: `arn:aws:ses:us-west-2:123:identity/*`,
        resourceLogs: `arn:aws:logs:*:*:log-group:*`,
      },
    },
    lamda: {
      name: "lamda_function",
    },
    appSync: {
      name: 'APP_SYNC_NAME',
      apiId: '123',
      apiKey: '123',
      authenticationType: 'API_KEY',
      schema: './src/app/graphql/schema.appsync.graphql',
      mappingTemplatesLocation: './mapping-templates',
      lambdaFunctionArn: 'arn:aws:lambda:us-west-2:123:function:lamda_function',
      serviceRoleArn: 'arn:aws:iam::123:role/LambdaAppSyncRole',
      appSyncServiceRole: { RoleName: 'LambdaAppSyncRole' }
    },
    environment: {
      NODE_ENV: 'test',
      JWT_SECRET: '12345',
      COOKIE_NAME: 'ipreplay',
      COOKIE_DOMAIN: 'http://localhost:8080',
      EMAIL_FROM: 'test@test.com',
      URI_FRONTEND: 'https://staging.dash.nezzoh.com',
      UNSUBSCRIBE_URI_FRONTEND: 'https://staging.dash.nezzoh.com/unsubscribe',
      AWS_SERVERLESS_SERVICE: 'aws_serverless_service',
      USE_AMAZON_SERVERLESS: 'false',
      USE_DYNAMO_REMOTE: 'true',
      AWS_ACCESS_KEY_ID: "",
      AWS_SECRET_ACCESS_KEY: "",
      AWS_REGION: ""

    },
  }

  it('should return correct values', () => {
    expect(getEnvVars()).to.containSubset(params)
  })

})

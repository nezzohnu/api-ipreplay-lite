const dotenv = require('dotenv')

if (process.env.NODE_ENV == "test") {
  dotenv.config({
    path: `${process.cwd()}/config/variables.env.aws.lamda.sample`
  })
} else {
  dotenv.config({
    path: `${process.cwd()}/config/variables.env.aws.lamda`
  })
}

module.exports.getEnvVars = () => ({
  service: process.env.AWS_SERVERLESS_SERVICE,
  accountId: process.env.ACCOUNT_ID,

  provider: {
    region: process.env.AWS_REGION,

    iamRoleStatements: {
      resourceDynamo: `arn:aws:dynamodb:${process.env.AWS_REGION}:*:*`,
      resourceSes: `arn:aws:ses:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:identity/*`,
      resourceLogs: `arn:aws:logs:*:*:log-group:*`,
    },
  },

  lamda: {
    name: process.env.AWS_LAMDA_FUNCTION_NAME,
  },

  appSync: {
    name: process.env.APP_SYNC_NAME || "api",
    apiId: process.env.APP_SYNC_API_ID || "",
    apiKey: process.env.APP_SYNC_API_KEY || "",

    authenticationType: process.env.APP_SYNC_AUTHENTICATION_TYPE || "API_KEY",
    schema: "./src/app/graphql/schema.appsync.graphql",
    mappingTemplatesLocation: "./mapping-templates",

    lambdaFunctionArn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:function:${process.env.AWS_LAMDA_FUNCTION_NAME}`,
    serviceRoleArn: `arn:aws:iam::${process.env.ACCOUNT_ID}:role/${process.env.APP_SYNC_SERVICE_ROLE_ROLE_NAME}`,

    appSyncServiceRole: {
      RoleName: process.env.APP_SYNC_SERVICE_ROLE_ROLE_NAME,
    },
  },

  environment: {
    NODE_ENV: process.env.NODE_ENV || "production",
    JWT_SECRET: process.env.JWT_SECRET,

    COOKIE_NAME: process.env.COOKIE_NAME,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,

    EMAIL_FROM: process.env.EMAIL_FROM,
    URI_FRONTEND: process.env.URI_FRONTEND,
    UNSUBSCRIBE_URI_FRONTEND: process.env.UNSUBSCRIBE_URI_FRONTEND,

    AWS_SERVERLESS_SERVICE: process.env.AWS_SERVERLESS_SERVICE || "ipreplay-service",
    // NOTE for remove init dotenv from config/settings
    USE_AMAZON_SERVERLESS: process.env.USE_AMAZON_SERVERLESS || "false",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,

    // NOTE for set remote dynamo db
    USE_DYNAMO_REMOTE: "true",
  },

})
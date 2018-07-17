import * as dotenv from "dotenv"

const initDotenv = () => {
  const path = (): string => {

    if (process.env.NODE_ENV && process.env.NODE_ENV != "development") {
      return `${process.cwd()}/config/variables.env.${process.env.NODE_ENV}`
    } else {
      return `${process.cwd()}/config/variables.env`
    }
  }

  dotenv.config({ path: path() })

  const checkRequiredEnv = (envs: string[]): void => {
    envs.map((env) => {
      if (!process.env[env]) {
        throw new Error(`process.env.${env} should be exist`)
      }
    })
  }

  checkRequiredEnv([
    "COOKIE_NAME",
    "COOKIE_DOMAIN",

    "JWT_SECRET",

    "EMAIL_FROM",

    // "URI_FRONTEND",
    // "UNSUBSCRIBE_URI_FRONTEND",
  ])

  const USE_DYNAMO_REMOTE = process.env.USE_DYNAMO_REMOTE === "false" ? false : true

  if (USE_DYNAMO_REMOTE) {
    checkRequiredEnv([
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_REGION",
    ])
  }
}

if (!process.env.USE_AMAZON_SERVERLESS) { initDotenv() }

interface Settings {
  readonly env: string
  readonly name: string
  readonly host: string
  readonly port: string
  readonly dbUrl: string
  readonly DEV: string
  readonly jwt_secret_key: string
  readonly salt_password: string

  readonly email_from: string
  readonly aws_access_key_id: string
  readonly aws_secret_access_key: string
  readonly aws_region: string

  readonly isEnvDev: boolean
  readonly isEnvTest: boolean
  readonly isEnvProd: boolean
  readonly isEnvStage: boolean

  readonly socket_origins: string
}

const settings: any = {
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: process.env.PORT || "8080",

  dynamo_local_url: process.env.DYNAMO_LOCAL_URL || "http://localhost:8000",
  dynamo_local_test_url: process.env.DYNAMO_LOCAL_TEST_URL || "http://localhost:8001",
  use_dynamo_remote: process.env.USE_DYNAMO_REMOTE === "true" ? true : false,

  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  // NOTE cookie
  cookie_name: process.env.COOKIE_NAME || "",
  cookie_domain: process.env.COOKIE_DOMAIN || "",

  jwt_secret_key: process.env.JWT_SECRET || "",
  salt_password: process.env.SALT_PASSWORD || "",

  DEV: process.env.DEV || "",

  isEnvDev: process.env.NODE_ENV == "development",
  isEnvTest: process.env.NODE_ENV == "test",
  isEnvProd: process.env.NODE_ENV == "production",
  isEnvStage: process.env.NODE_ENV == "staging",

  // NOTE Amazon SES
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || "",
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || "",
  aws_serverless_service: process.env.AWS_SERVERLESS_SERVICE || "",
  aws_region: process.env.AWS_REGION || "us-west-2",

  // NOTE Email
  email_from: process.env.EMAIL_FROM || "",
  uri_frontend: process.env.URI_FRONTEND || "",

  // NOTE now use `${settings.uri}/unsubscribe/${encodeURIComponent(user.email)}` in app/services/emails/options_confirm_email
  unsubscribe_uri_frontend: process.env.UNSUBSCRIBE_URI_FRONTEND || "",

  socket_origins: process.env.SOCKET_ORIGINS || "http://localhost:3000/",

  use_amazon_serverless: process.env.USE_AMAZON_SERVERLESS === "true" ? true : false,
}

export default settings

import settings from 'config/settings'

describe(__filename, () => {

  const params = {
    env: process.env.NODE_ENV,
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: process.env.PORT || "8080",

    jwt_secret_key: process.env.JWT_SECRET || "",
    salt_password: process.env.SALT_PASSWORD || "",

    DEV: process.env.DEV || "",

    isEnvDev: process.env.NODE_ENV == "development",
    isEnvTest: process.env.NODE_ENV == "test",
    isEnvProd: process.env.NODE_ENV == "production",
    isEnvStage: process.env.NODE_ENV == "staging",

    // NOTE Amazon SES
    email_from: process.env.EMAIL_FROM || "",
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || "",
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || "",
    aws_region: process.env.AWS_REGION || "",

    // NOTE Email
    uri_frontend: process.env.URI_FRONTEND || "",
    unsubscribe_uri_frontend: process.env.UNSUBSCRIBE_URI_FRONTEND || "",

    socket_origins: process.env.SOCKET_ORIGINS || "http://localhost:3000/",
  }

  it('should return correct values', () => {
    expect(settings).to.containSubset(params)
  })

})

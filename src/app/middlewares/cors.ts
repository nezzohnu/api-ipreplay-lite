import * as corsMiddleware from 'restify-cors-middleware'
import settings from 'config/settings'

export const buildCors = (): any => {
  if (settings.isEnvDev || settings.isEnvStage) {
    return corsMiddleware({
      preflightMaxAge: 5,
      origins: ["*"],
      allowHeaders: ["Cookie", "cookie", 'x-relay', 'origin', 'content-type', "Authorization", "x-public-key", "*"],
      exposeHeaders: ['Set-Cookie'],
    })
  } else {
    return corsMiddleware({
      preflightMaxAge: 5,
      // Whitelist public domains here
      origins: [
        '*.ipreplay.com'
      ],
      allowHeaders: ["Cookie", "cookie", 'x-relay', 'origin', 'content-type', "Authorization", "x-public-key"],
      exposeHeaders: ['Set-Cookie'],
      credentials: true,
    })
  }
}

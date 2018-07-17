import * as cookie from "cookie"
import { path } from "ramda"
import { User } from "app/models"
import { verifyJwt } from "app/services/jwt"
import settings from "config/settings"
import logger from "app/services/logger"
export const throwUnauthorizedError = (): any => {
  throw new Error("access is denied")
}

export const getOptionsFind = (args: any): any => {
  const skip = parseInt(path(["input", "offset"], args)) || 0
  const limit = parseInt(path(["input", "limit"], args)) || 15
  let sort = path(["input", "sort"], args) || ""

  return { skip, limit, sort }
}

export const getTokenFromHeaderOrCookie = (headers: any = {}): string | null => {
  if (!headers) { return }

  let tokenCookie
  let tokenHeader

  const cookieString = headers['Cookie'] || headers['cookie']

  if (cookieString) {
    const cookies = cookie.parse(cookieString)
    tokenCookie = cookies[settings.cookie_name]
  }

  let jwtString = headers['Authorization'] || headers['authorization']

  if (jwtString) {
    jwtString = jwtString.split(" ")
    tokenHeader = jwtString && jwtString[1]
  }

  return tokenCookie || tokenHeader
}

export const getPublicKeyFromHeaderOrCookie = (headers: any = {}): string | null => {
  if (!headers) { return }
  let publicKeyCookie
  let publicKeyHeader

  const cookieString = headers['Cookie'] || headers['cookie']

  if (cookieString) {
    const cookies = cookie.parse(cookieString)
    publicKeyCookie = cookies[settings.cookie_name]
  }

  publicKeyHeader = headers['X-public-key'] || headers['x-public-key'] || headers['X-Public-Key']
  logger.info('PublicKey', publicKeyHeader)
  return publicKeyCookie || publicKeyHeader
}

export const setCookieHeader = (res: any, value: any): void => {
  const HEADER = "Set-Cookie"

  const options = {
    domain: settings.cookie_domain,
    path: "/",
    maxAge: 1000 * 60 * 60, // would expire after 60 minutes
    secure: false,
    httpOnly: true,
  }

  res.setHeader(HEADER, cookie.serialize(settings.cookie_name, value, options))
}

export const authenticated = (fn: any) => async (parent: any, args: any, ctx: any, info: any) => {
  let { token } = ctx

  if (!token) {
    throw new Error("token should exist")
  }

  let payload
  try {
    payload = await verifyJwt(token)
  } catch (err) {
    throw new Error("token not valid")
  }
  const user = await User.findById(payload.user_id)
  if (!user) {
    throw new Error("User not found. Verify Authorization credentials")
  }
  ctx.user = user
  return fn(parent, args, ctx, info)
}

export const authenticatedPublic = (fn: any) => async (parent: any, args: any, ctx: any, info: any) => {
  let { publicKey } = ctx

  if (!publicKey) {
    throw new Error("Public key should exist")
  }

  const user = await User.findOne({ publicKey: { eq: publicKey } })

  if (!user) {
    throw new Error("User not found")
  }

  ctx.user = user
  return fn(parent, args, ctx, info)
}

export const getOptionsLimitOffset = (args: any): any => {
  const limit = parseInt(path(["input", "limit"], args)) || 15
  const startAtKey = path(["input", "offset"], args) || null

  let startAt = null

  if (startAtKey) {
    startAt = { id: { S: startAtKey } }
  }

  return { limit, startAt }
}

export const getLastKey = (objects: any): any => {
  return path(["lastKey", "id", "S"], objects) || null
}

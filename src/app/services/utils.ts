import * as errs from "restify-errors"
import * as crypto from 'crypto'
import settings from "config/settings"

const emailRegexp = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

export const validateEmail = (email: string): boolean => {
  if (email === "" || email === undefined) {
    return true
  }

  return emailRegexp.test(email)
}

export const normalizeEmail = (email: string): string | boolean => {
  if (emailRegexp.test(email)) {
    return emailRegexp.exec(email)[0]
  }

  return false
}

export const validateAttempts = (attempt: number): boolean => {
  if (attempt > 2) {
    return false;
  }
}

export const buildCode = () => { return crypto.randomBytes(20).toString('hex') }

export const addDays = (date, days) => {
  let result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const internalServerError = (err: any): any => {
  return new errs.InternalServerError(err.message)
}

export const unauthorizedError = (): any => {
  return new errs.UnauthorizedError("access is denied")
}

export const unprocessableEntityError = (message): any => {
  return new errs.UnprocessableEntityError(message)
}

export const setCookieResJwt = (res: any, jwt: any): void => {
  const cookieOptions = {
    domain: settings.cookie_domain,
    path: "/",
    maxAge: 1000 * 60 * 60, // would expire after 60 minutes
    secure: false,
    httpOnly: true,
  }

  res.setCookie(settings.cookie_name, jwt, cookieOptions)
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
export const calculateDelay = (num) => 0.1 * (2 ** (num + 3))

import * as errs from "restify-errors"
import settings from 'config/settings'
import { User } from "app/models"
import { verifyJwt } from 'app/services/jwt'

export default async (req, res, next) => {
  const cookieJwt = req.cookies && req.cookies[settings.cookie_name]

  if (!req.header('Authorization') && !cookieJwt) {
    return next(new errs.UnauthorizedError(`header Authorization Bearer TOKEN_HERE not found or cookie ${settings.cookie_name}`))
  }

  const parts = req.header('Authorization') && req.header('Authorization').split(' ')
  const token = parts && parts[1] || cookieJwt

  if (!token) {
    return next(new errs.UnauthorizedError("invalid token"))
  }

  try {
    const payload: any = verifyJwt(token)

    req.payload = payload

    const { user_id } = payload

    if (!user_id) {
      return next(new errs.UnauthorizedError("payload should have user_id"))
    }

    req.user_id = user_id
    req.user = await User.findById(user_id)

    if (!req.user) {
      return next(new errs.UnauthorizedError("user not found"))
    }

    if (req.log && !settings.isEnvTest) {
      req.log.info(`login as ${payload.user_id}, ${payload.email}`)
    }

    return next()
  } catch (err) {
    return next(err)
  }
}

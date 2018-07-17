import * as jsonwebtoken from 'jsonwebtoken'
import settings from 'config/settings'

export const createJwt = (user: any): any => {
  if (!settings.jwt_secret_key) {
    throw new Error('process.env.JWT_SECRET should be exist')
  }

  const twoDays = 3600000 * 48

  return jsonwebtoken.sign(
    {
      user_id: user.id,
    },
    settings.jwt_secret_key,
    {
      expiresIn: new Date().getTime() + twoDays
    }
  )
}

export const verifyJwt = (token: string, cb?: any): any => {
  return jsonwebtoken.verify(
    token,
    settings.jwt_secret_key,
    {},
    cb
  )
}

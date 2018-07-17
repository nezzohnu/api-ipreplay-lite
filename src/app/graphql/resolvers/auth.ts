import { User } from "app/models"
import { createJwt } from "app/services/jwt"
import { setCookieHeader } from "app/services/graphql"
import { authenticated } from "app/services/graphql"

// NOTE any users can get token
export const createToken = async (root: any, args: any, ctx: any) => {
  const { email, password } = args.input
  const { res } = ctx

  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("user not found")
  }

  if (!await user.comparePassword(password)) {
    throw new Error("wrong password")
  }

  const jwt = await createJwt(user)

  setCookieHeader(res, jwt)

  return {
    token: jwt,
    publicKey: user.publicKey,
    namespace: user.namespace,
  }
}

// NOTE any users can get confirm
export const confirm = async (root: any, args: any, ctx: any) => {
  const { code } = args.input
  const { req, res } = ctx

  if (!code) throw new Error("code should be exist")

  const user = await User.findOne({ confirmCode: code })

  if (!user) throw new Error("user not found")

  await user.confirmAction({
    userAgent: req.headers["userAgent"] || req.headers["user-agent"],
    ip: req.headers['x-forwarded-for'],
  })

  const jwt = await createJwt(user)

  setCookieHeader(res, jwt)

  return {
    value: "ok",
    namespace: user.namespace,
  }
}

// NOTE any authorize users can sendConfirm
export const sendConfirm = authenticated(async (root: any, args: any, ctx: any) => {
  const { user } = ctx

  await user.sendConfirmEmail()

  return {
    value: "ok",
    namespace: user.namespace,
  }
})

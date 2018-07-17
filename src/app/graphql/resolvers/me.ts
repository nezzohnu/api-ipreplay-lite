import { merge } from "ramda"
import { User } from "app/models"
import { authenticated, throwUnauthorizedError } from "app/services/graphql"

// NOTE any user get me
export const me = authenticated(async (root: any, args: any, ctx: any) => {
  const { user } = ctx
  return user
})

// NOTE any user update me
export const updateMe = authenticated(async (root: any, args: any, ctx: any) => {
  let { user } = ctx
  let body = args.input

  // NOTE unconfirm email if change
  if (body.email) {
    body = merge(body, { cofirmEmail: false })
  }

  await user.set(body)
  await user.save()

  return user
})

// NOTE any user update password
export const updatePasswordMe = authenticated(async (root: any, args: any, ctx: any) => {
  const { user } = ctx
  const { oldPassword, newPassword } = args.input

  if (await user.comparePassword(oldPassword)) {
    await user.set({ password: newPassword })
    await user.save()
  } else {
    throw new Error("wrong password")
  }

  return user
})

// NOTE any user delete me
export const deleteMe = authenticated(async (root: any, args: any, ctx: any) => {
  const { password } = args.input
  const { user } = ctx

  if (await user.comparePassword(password)) {
    await user.remove()
  } else {
    throw new Error("wrong password")
  }

  return user
})

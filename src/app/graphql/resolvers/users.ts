import { path } from "ramda"
import { User } from "app/models"
import { authenticated, getOptionsLimitOffset, getLastKey } from "app/services/graphql"
import { authorize } from "app/policy"
// import sendEmail from "app/services/emails/send"
// import optionsConfirmEmail from "app/services/emails/options_confirm_email"

// NOTE only root get users
export const users = authenticated(async (root: any, args: any, ctx: any) => {
  const { user } = ctx

  authorize(user, "read", User)

  const users = await User.find({}, null, getOptionsLimitOffset(args))

  let response = {
    users,
    namespace: user.namespace,
    total: users.count,
    lastKey: getLastKey(users),
  }

  return response
})

// NOTE only root get users
export const user = authenticated(async (root: any, args: any, ctx: any) => {
  const { user } = ctx
  const { id } = args.input

  authorize(user, "read", User)

  const showUser = await User.findById(id)

  let response = {
    user: showUser,
    namespace: user.namespace,
  }

  return response
})

// NOTE any user can create user
export const createUser = async (root: any, args: any, ctx: any) => {
  let emailError = null
  const { user } = ctx

  if (await User.isEmailAlreadyExist(path(["input", "email"], args))) {
    throw new Error("email already exist")
  }

  const newUser = await User.create(args.input)

  try {
    // await sendEmail(await optionsConfirmEmail(newUser.email))
  } catch (err) {
    emailError = err.message
  }

  let response = {
    user: newUser,
    namespace: user && user.namespace,
    emailError,
  }

  return response
}


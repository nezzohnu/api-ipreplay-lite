import { authenticated } from "app/services/graphql"

const checkNamespaceUser = async (root: any, args: any, ctx: any) => {
  const { user } = ctx
  const { namespace } = args

  if (user.namespace !== namespace) {
    throw new Error("not valid namespace")
  }

  return {
    namespace: user.namespace,
  }
}
export const subscribeToLogPixel = authenticated(checkNamespaceUser)

import schema from './schema'
import { getTokenFromHeaderOrCookie, getPublicKeyFromHeaderOrCookie } from 'app/services/graphql'

export default (req: any, res: any) => {

  return {
    schema,

    formatError: (err: any) => ({
      message: err.message,
      status: err.status
    }),

    context: {
      token: getTokenFromHeaderOrCookie(req.headers),
      publicKey: getPublicKeyFromHeaderOrCookie(req.headers),
      user: null,
      req,
      res,
    },

  }
}

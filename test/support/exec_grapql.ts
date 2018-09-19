import * as sinon from 'sinon'
import { graphql } from 'graphql'
import { createJwt } from "app/services/jwt"
import { Context } from "app/grapql/config"
import schema from 'app/graphql/schema'

export default async (options: { query, variableValues, rootValue, user }): Promise<any> => {
  const { query, variableValues, rootValue, user } = options
  const context = await buildContext(user)
  return await graphql(schema, query, rootValue || {}, context, variableValues || {})
}

const buildContext = async (user: any): Context => {
  let token = null
  let publicKey = null

  if (user) {
    token = await createJwt(user)
    publicKey = user.publicKey
  }

  let context = {
    token,
    res: {
      setCookie: sinon.stub(),
      setHeader: sinon.stub(),
    },
    req: {
      headers: {
        "userAgent": "userAgent",
        "user-agent": "user-agent",
        'x-forwarded-for': "x-forwarded-for",
      },
    }
  }

  if (publicKey) context.req.headers['x-public-key'] = publicKey

  if (token) context.req.headers['x-api-key'] = token

  return context
}

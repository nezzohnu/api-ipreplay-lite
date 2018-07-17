import * as sinon from 'sinon'
import { graphql } from 'graphql'
import { createJwt } from "app/services/jwt"
import { Context } from "app/grapql/config"
import schema from 'app/graphql/schema'

export default async (options: { query, variableValues, rootValue, user, unauth, publicKey }): Promise<any> => {
  const { query, variableValues, rootValue, user, unauth, publicKey } = options
  const context = await buildContext(user, unauth, publicKey)
  return await graphql(schema, query, rootValue || {}, context, variableValues || {})
}

const buildContext = async (user: any, unauth: boolean, publicKey: string): Context => {
  let token = null

  if (!unauth && !user) {
    const user = await factory.create("user")
    token = await createJwt(user)
  }

  if (user) token = await createJwt(user)

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
        'x-forwarded-for': "x-forwarded-for"
      },
    }
  }
  if (publicKey) {
    context.req.headers['x-public-key'] = publicKey
  }
  return context
}

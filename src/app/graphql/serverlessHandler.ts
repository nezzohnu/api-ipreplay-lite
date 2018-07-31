import { path } from "ramda"
import { graphqlLambda } from "apollo-server-lambda"
import resolvers from "./resolvers"
import schema from './schema'
import logger from "app/services/logger"
import { getTokenFromHeaderOrCookie, getPublicKeyFromHeaderOrCookie } from "app/services/graphql"

const res = {
  headers: {},
  setHeader: function (key, value) {
    this.headers[key] = value
  },
}

const haveHeaderWithRequestType = (event) => {
  const requestType = path(["headers", "request-type"], event)
  const RequestType = path(["headers", "Request-type"], event)

  return requestType == "graphql" || RequestType == "graphql"
}

const graphqlHandler = async (event, context, callback) => {

  const callbackFilter = (error, output) => {
    if (output && output.headers) {
      output.headers['Access-Control-Allow-Origin'] = '*'
      output.headers["Set-Cookie"] = res.headers["Set-Cookie"]
    }

    return callback(error, output)
  }

  const config = {
    schema,
    tracing: true,
    context: {
      token: getTokenFromHeaderOrCookie(event.headers),
      publicKey: getPublicKeyFromHeaderOrCookie(event.headers),
      user: null,
      req: event,
      res,
    },
  }

  const handler = graphqlLambda(config)

  return handler(event, context, callbackFilter)
}

const appAsyncHandler = async (event, context, callback) => {
  const { args, name, type } = event

  if (!name || !type) {
    return context.fail(new Error("event.name or event.type should be exist"), null)
  }

  const func = path([type, name], resolvers)

  if (!func) {
    return context.fail(new Error("event.name or event.type not valid"), null)
  }

  const res = {
    headers: {},
    setHeader: function (key, value) { this.headers[key] = value },
  }

  const ctx = {
    token: getTokenFromHeaderOrCookie(event.headers),
    publicKey: getPublicKeyFromHeaderOrCookie(event.headers),
    user: null,
    req: event,
    res,
  }

  try {
    let result = await func(null, args, ctx)

    return context.succeed(result)
  } catch (err) {

    return context.fail(err)
  }
}

export default async (event, context, callback) => {
  logger.info("EVENT", event)
  logger.info('CTXT', context)

  if (haveHeaderWithRequestType(event)) {
    return await graphqlHandler(event, context, callback)
  } else {
    return await appAsyncHandler(event, context, callback)
  }
}

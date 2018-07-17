import * as restify from 'restify'
import settings from 'config/settings'
import logger from 'app/services/logger'
import InitMiddlewares from 'app/middlewares'
import initRoutesV1 from 'config/routes'
import InitSubscriptionServerV2 from "app/graphql/subscriptionServer"

if (settings.DEV) {
  process.on('SIGUSR2', () => {
    console.log('KILLING PROCESS')
    process.exit(0)
  })
}

let server = restify.createServer({
  log: logger,
  handleUncaughtExceptions: true
})

InitMiddlewares(server)
InitSubscriptionServerV2(server)

// NOTE custom errors
server.on('restifyError', (req, res, err, next) => {
  res.header("x-relay", "OnErrors")

  const error = {
    meta: {
      relay: "OnErrors"
    },
    errors: [{
      title: err.name,
      detail: err.message,
    }]
  }

  err.toJSON = function customToJSON() { return error }
  logger.error(err)
  next()
})

server.get(/\/sdk\/.*/, restify.plugins.serveStatic({ directory: "./public" }))

// NOTE init routes
initRoutesV1(server)

export default server

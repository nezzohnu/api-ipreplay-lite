import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import settings from 'config/settings'
import schema from './schema'

const WS_PORT = 5000

export default (server: any): any => {
  if (settings.isEnvTest) return

  const ws = createServer((req, res) => {
    console.log("connect to ws")

    res.writeHead(404)
    res.end()
  })

  ws.listen(WS_PORT, () => {
    if (!settings.isEnvTest) {
      console.log(`GraphQL subscription server is now running on http://localhost:${WS_PORT}`)
    }

    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    })

  })

}

import { graphqlRestify } from 'apollo-server-restify'
import graphQLOptions from 'app/graphql/config'

export default (server: any) => {
  server.post('/api/v1', graphqlRestify(graphQLOptions))
  server.get('/api/v1', graphqlRestify(graphQLOptions))
}

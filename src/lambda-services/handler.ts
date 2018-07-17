import serverlessHandler from "app/graphql/serverlessHandler"

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  return serverlessHandler(event, context, callback)
}

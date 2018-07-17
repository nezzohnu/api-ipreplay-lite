import { graphqlHandler } from "../../src/lambda-services/handler"
import * as sinon from 'sinon'


export default async (query, input, publicKey) => {
    const context = sinon.spy()
    const callback = sinon.spy()

    let event = {
        httpMethod: "POST",
        headers: {
            "request-type": "graphql"
        },
        body: {
            query,
            variables: {
                input: input
            },
        },
    }

    if (publicKey) {
        event.headers["x-public-key"] = publicKey
    }

    let res = await graphqlHandler(event, context, callback)
    return JSON.parse(callback.args[0][1].body)
}
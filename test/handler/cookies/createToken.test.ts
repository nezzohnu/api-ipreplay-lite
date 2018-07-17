import "../../support/hooks"
import { graphqlHandler } from "../../../src/lambda-services/handler"
import { History } from "app/models"
import * as sinon from "sinon"

const query = `
  mutation createToken($input: CreateTokenInput!) {
    createToken(input: $input) {
      token
      namespace
    }
  }
`

describe(__filename, () => {

  describe("createToken", () => {
    const email = "test@test.com"
    const password = "12345"
    const context = sinon.spy()
    const callback = sinon.spy()
    let event
    let res
    let user

    beforeEach(async () => {
      user = await factory.create("user", { email, password })

      event = {
        httpMethod: "POST",
        headers: {
          "request-type": "graphql",
        },
        body: {
          query,
          variables: {
            input: {
              email,
              password,
            }
          },
        },
      }

      let res = await graphqlHandler(event, context, callback)

    })

    it('should return header Set Cookie', async () => {
      let result = callback.args[0][1]

      expect(result.headers["Set-Cookie"]).to.be.string
    })
  })

})

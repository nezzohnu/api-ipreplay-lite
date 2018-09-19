import "../../support/hooks"
import { graphqlHandler } from "../../../src/lambda-services/handler"
import * as sinon from "sinon"

describe(__filename, () => {

  describe("confirm", () => {
    let user
    let context
    let callback
    let event
    const userAgent = "userAgent"
    const xForwardedFor = "xForwardedFor"

    beforeEach(async () => {
      user = await factory.create("user")
      context = sinon.spy()
      callback = sinon.spy()

      event = {
        type: "Mutation",
        name: "confirm",
        args: {
          input: {
            code: user.confirmCode,
          }
        },
        headers: {
          "userAgent": userAgent,
          "x-forwarded-for": xForwardedFor,
          "request-type": "graphql"
        },
      }

      await graphqlHandler(event, context, callback)
    })

    it('should callback called', async () => {
      expect(callback.called).to.eql(true)
    })

  })

})


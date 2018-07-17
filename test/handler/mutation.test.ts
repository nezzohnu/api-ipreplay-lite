import "../support/hooks"
import { graphqlHandler } from "../../src/lambda-services/handler"
import { History } from "app/models"
import * as sinon from "sinon"

describe(__filename, () => {

  describe("createToken", () => {
    const email = "test@test.com"
    const password = "12345"

    it('should return result', async () => {
      const user = await factory.create("user", { email, password })

      const event = {
        type: "Mutation",
        name: "createToken",
        args: {
          input: {
            email,
            password,
          }
        },
        headers: {
          "request-type": "graphql"
        }
      }

      const context = sinon.spy()
      const callback = sinon.spy()

      await graphqlHandler(event, context, callback)

      expect(callback.called).to.eql(true)
    })
  })

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

import "../../support/hooks"
import { User } from "app/models"
import { createJwt } from "app/services/jwt"

const query = `
  mutation confirm($input: ConfirmInput!) {
    confirm(input: $input) {
      value
      namespace
    }
  }
`

describe(__filename, () => {

  describe("valid params given", () => {
    describe("user exist", async () => {
      let user
      let res

      beforeEach(async () => {
        user = await factory.create('user')

        const variableValues = {
          input: {
            code: user.confirmCode,
          }
        }

        res = await execGraphql({ query, variableValues, unauth: true })
      })

      it("should have value", async () => {
        expect(res.data.confirm).to.have.property("value").eql("ok")
      })

      it("should have meta", async () => {
        expect(res.data.confirm).to.have.property("namespace").eql(user.namespace)
      })

      it("should update user cofirmEmail", async () => {
        let updateUser = await User.findById(user.id)
        expect(updateUser.confirmEmail).to.eql(true)
      })
    })
  })

  describe("wrong params given", () => {
    describe("without code", () => {
      let res

      beforeEach(async () => {
        const variableValues = {
          input: {
          }
        }

        res = await execGraphql({ query, variableValues, unauth: true })
      })

      it("should return status 422", async () => {
        expect(res.errors[0]).to.have.property("message")
      })
    })
  })

})

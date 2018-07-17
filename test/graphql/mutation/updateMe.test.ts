import "../../support/hooks"
import { User } from "app/models"

const password = "password"
const query = `
  mutation updateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      ${matchers.userAttr}
    }
  }
`

describe(__filename, () => {

  describe("valid params given", async () => {
    let user
    let newUser
    let res

    beforeEach(async () => {
      user = await factory.create('user', { password })
      newUser = await factory.build('user', { email: "test@test.com" })

      const variableValues = {
        input: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        }
      }

      res = await execGraphql({ query, variableValues, user })

    })

    it("should update name", async () => {
      const attrs = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
      expect(res.data.updateMe).to.containSubset(attrs)
    })
  })

  describe("wrong params given", () => {
    describe("wrong role", () => {
      let user
      let newUser
      let res

      beforeEach(async () => {
        user = await factory.create('user', { password })
        newUser = await factory.build('user', { email: "test@test.com" })

        const variableValues = {
          input: {
            role: "admin",
          }
        }

        res = await execGraphql({ query, variableValues, user })
      })

      it("should not update role", async () => {
        expect(res.errors[0]).to.have.property('message')
      })
    })
  })

  describe("user unauthorized", () => {
    let res

    it("should not req unauth", async () => {
      const variableValues = {
        input: {
          firstName: "firstName",
        }
      }

      res = await execGraphql({ query, variableValues, unauth: true })

      expect(res.errors[0]).to.have.property('message').eql("token should exist")
    })
  })

})

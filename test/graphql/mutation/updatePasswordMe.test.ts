import "../../support/hooks"
import { User, Company } from "app/models"

const query = `
  mutation updatePasswordMe($input: UpdatePasswordMeInput!) {
    updatePasswordMe(input: $input) {
      ${matchers.userAttr}
    }
  }
`

describe(__filename, () => {

  describe("valid params given", () => {
    let user
    let newUser
    let res
    let oldPassword = "oldPassword"
    let newPassword = "newPassword"

    beforeEach(async () => {
      user = await factory.create('user', { password: oldPassword })

      const variableValues = {
        input: {
          oldPassword,
          newPassword,
        }
      }

      res = await execGraphql({ query, variableValues, user })

    })

    it("should have user", async () => {
      const attrs = {
        id: user.id,
      }

      expect(res.data.updatePasswordMe).to.containSubset(attrs)
    })

    it("should replace old password", async () => {
      user = await User.findById(user.id)
      let res = await user.comparePassword(oldPassword)

      expect(res).to.eql(false)
    })

    it("should set new password", async () => {
      user = await User.findById(user.id)
      let res = await user.comparePassword(newPassword)

      expect(res).to.eql(true)
    })
  })

  describe("wrong params given", () => {
    let user
    let res
    let oldPassword = "oldPassword"
    let newPassword = "newPassword"

    beforeEach(async () => {
      user = await factory.create('user', { password: oldPassword })

      const variableValues = {
        input: {
          oldPassword: "wrong password",
          newPassword,
        }
      }

      res = await execGraphql({ query, variableValues, user })

    })

    it("should have error", async () => {
      expect(res.errors[0]).to.have.property('message').eql("wrong password")
    })

    it("should not replace old password", async () => {
      user = await User.findById(user.id)
      let res = await user.comparePassword(oldPassword)

      expect(res).to.eql(true)
    })

    it("should not set new password", async () => {
      user = await User.findById(user.id)
      let res = await user.comparePassword(newPassword)

      expect(res).to.eql(false)
    })
  })

  describe("user unathorized", () => {
    let res
    beforeEach(async () => {
      const variableValues = {
        input: {
          oldPassword: "oldPassword",
          newPassword: "newPassword",
        }
      }

      res = await execGraphql({ query, variableValues, unauth: true })
    })

    it("should not req unauth", async () => {
      expect(res.errors[0]).to.have.property('message').eql("token should exist")
    })
  })

})

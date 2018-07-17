import "../../support/hooks"
import { User } from "app/models"

const password = "password"
const query = `
  mutation deleteMe($input: DeleteMeInput!) {
    deleteMe(input: $input) {
      ${matchers.userAttr}
    }
  }
`

describe(__filename, () => {

  describe("valid params given", () => {
    let user
    let event
    let res

    beforeEach(async () => {
      user = await factory.create("user", { password })

      const variableValues = {
        input: {
          password,
        }
      }

      res = await execGraphql({ query, variableValues, user })
    })

    it("should delete company", async () => {
      expect(res.data.deleteMe).to.containSubset({ id: user.id })
    })

    it("should remove in db", async () => {
      expect(await User.find({})).to.be.empty
    })
  })

  describe("wrong params given", () => {
    let user
    let event
    let res

    beforeEach(async () => {
      user = await factory.create("user")

      const variableValues = {
        input: {
          password,
        }
      }

      res = await execGraphql({ query, variableValues, user })
    })

    it("should delete company", async () => {
      expect(res).to.have.property('errors')
    })

    it("should remove in db", async () => {
      expect(await User.find({})).to.not.be.empty
    })
  })

  describe("user unathorize", () => {
    let res
    let user
    let event

    beforeEach(async () => {
      user = await factory.create("user")

      const variableValues = {
        input: {
          password,
        }
      }

      res = await execGraphql({ query, variableValues, unauth: true })
    })

    it("should return error", async () => {
      expect(res).to.have.property('errors')
    })
  })

})

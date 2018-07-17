import "../support/hooks"
import { can } from "app/policy"

describe(__filename, () => {

  describe("read", () => {
    it("guest cannot read user", async () => {
      const user = await factory.create("userGuest")
      const findUser = await factory.create("user")

      let res = can(user, "read", findUser)

      expect(res).to.eql(false)
    })

    it("user cannot read guest", async () => {
      const user = await factory.create("user")
      const findUser = await factory.create("userGuest")

      let res = can(user, "read", findUser)

      expect(res).to.eql(false)
    })

  })

  describe("update", () => {
    it("guest cannot update user", async () => {
      const user = await factory.create("userGuest")
      const findUser = await factory.create("user")

      let res = can(user, "update", findUser)

      expect(res).to.eql(false)
    })

    it("user cannot update guest", async () => {
      const user = await factory.create("user")
      const findUser = await factory.create("userGuest")

      let res = can(user, "update", findUser)

      expect(res).to.eql(false)
    })
  })

  describe("delete", () => {
    it("guest cannot delete user", async () => {
      const user = await factory.create("userGuest")
      const findUser = await factory.create("user")

      let res = can(user, "delete", findUser)

      expect(res).to.eql(false)
    })

    it("user cannot delete guest", async () => {
      const user = await factory.create("user")
      const findUser = await factory.create("userGuest")

      let res = can(user, "delete", findUser)

      expect(res).to.eql(false)
    })
  })

})

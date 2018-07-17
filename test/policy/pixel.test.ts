import "../support/hooks"
import { Pixel } from "app/models"
import { can } from "app/policy"

describe(__filename, () => {

  describe("readAnyPixel", () => {
    it("guest cannot read any pixel", async () => {
      const user = await factory.create("userGuest")

      let res = can(user, "readAnyPixel", Pixel)

      expect(res).to.eql(false)
    })
  })

})

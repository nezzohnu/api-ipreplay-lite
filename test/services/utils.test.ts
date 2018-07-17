import { calculateDelay } from "app/services/utils"

describe(__filename, () => {

  describe('calculateDelay', () => {
    it("should return valid result", async () => {
      let res = calculateDelay(0)

      expect(res).to.eql(0.8)
    })

    it("should return valid result", async () => {
      let res = calculateDelay(1)

      expect(res).to.eql(1.6)
    })

    it("should return valid result", async () => {
      let res = calculateDelay(2)

      expect(res).to.eql(3.2)
    })

    it("should return valid result", async () => {
      let res = calculateDelay(3)

      expect(res).to.eql(6.4)
    })
  })

})

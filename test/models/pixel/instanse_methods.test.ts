import "../../support/hooks"
import { Pixel } from "app/models"

describe(__filename, () => {

  describe('.isLimitCount', async () => {
    it('valid', async () => {
      const sessionId = "sessionId"

      let pixel1 = await factory.create('pixel', { sessionId })
      let pixel2 = await factory.create('pixel', { sessionId })

      let res = await Pixel.isLimitCount(sessionId)

      expect(res).to.eql(false)
    })
  })

  describe('.countBySessionId', async () => {
    it('with pixels', async () => {
      const sessionId = "sessionId"

      let pixel1 = await factory.create('pixel', { sessionId })
      let pixel2 = await factory.create('pixel', { sessionId })

      let res = await Pixel.countBySessionId(sessionId)

      expect(res).to.eql(2)
    })

    it('with pixels', async () => {
      const sessionId = "sessionId"
      const otherSessionId = "otherSessionId"

      let pixel1 = await factory.create('pixel', { sessionId })
      let pixel2 = await factory.create('pixel', { sessionId: otherSessionId })

      let res = await Pixel.countBySessionId(sessionId)

      expect(res).to.eql(1)
    })

    it('without pixels', async () => {
      const sessionId = "sessionId"

      let res = await Pixel.countBySessionId(sessionId)

      expect(res).to.eql(0)
    })
  })

})

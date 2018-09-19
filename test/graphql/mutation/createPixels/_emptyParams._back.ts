import "../../../support/hooks"
import * as sinon from 'sinon'
import Pixel from "app/models/pixel"
const action = "createPixels"
const query = `
  mutation createPixels($input: CreatePixelsInput!) {
    createPixels(input: $input) {
      pixels{
        id

        event
        typeEvent
        level
        payload
        state
        timestamp
        sessionId
        namespace
      
        createdAt
        updatedAt
      }
      namespace
      total
      lastKey
    }
  }
`
/**@todo FIX */
describe(__filename, () => {

  describe('empty params given', () => {
    let res
    let user
    const context = sinon.spy()
    const callback = sinon.spy()

    beforeEach(async () => {
      user = await factory.create("user")


      const input = {}

      res = await graphqlHandler(query, input, user.publicKey)
    })

    it("should reture empty data", async () => {
      expect(res.data[action].pixels).to.eql([])
    })

    it("should return total as null", async () => {
      expect(res.data[action].total).to.eql(null)
    })
  })

})

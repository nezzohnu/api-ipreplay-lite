import "../../../support/hooks"

const action = "createPixels"
const query = `
  mutation createPixels($input: CreatePixelsInput!) {
    createPixels(input: $input) {
      pixels {
        ${matchers.pixelAttr}
      }
      namespace
      total
      lastKey
    }
  }
`

describe(__filename, () => {

  describe('valid params given', () => {

    describe('user is guest', () => {
      let user
      let res
      const timestamp = `${new Date().getTime()}`

      beforeEach(async () => {
        user = await factory.create("userGuest")

        const input = {
          pixels: [
            {
              event: "event1",
              typeEvent: "event",
              level: "info",
              payload: JSON.stringify({ payload: 'event1' }),
              timing: JSON.stringify({ payload: 'event1' })
            },
            {
              typeEvent: "tracking",
              event: "event2",
              level: "info",
              payload: JSON.stringify({ payload: 'event2' }),
              timing: JSON.stringify({ payload: 'event2' })
            },
          ],
          meta: {
            state: "state",
            sessionId: "sessionId",
            timestamp,
          },
        }

        res = await graphqlHandler(query, input, user.publicKey)

      })

      it(`should return event1`, async () => {
        const attr = {
          event: "event1",
          typeEvent: "event",
          level: "info",
          payload: JSON.stringify({ payload: 'event1' }),
          state: "state",
          timestamp,
          sessionId: "sessionId",
          namespace: user.namespace,
        }

        expect(res.data[action].pixels).to.containSubset([attr])
      })

      it(`should return event2`, async () => {

        const attr = {
          event: "event2",
          typeEvent: "tracking",
          level: "info",
          payload: JSON.stringify({ payload: 'event2' }),
          state: "state",
          timestamp,
          sessionId: "sessionId",
          namespace: user.namespace,
        }

        expect(res.data[action].pixels).to.containSubset([attr])
      })

      it(`should return total`, async () => {
        expect(res.data[action].total).to.eql("2")
      })

    })

  })

})

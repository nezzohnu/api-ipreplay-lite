import "../../support/hooks"

describe("attributes", () => {
  it("should have attributes", async () => {
    let pixel = await factory.create('pixel')

    const attributes = [
      "id",
      "event",
      "typeEvent",
      "level",
      "payload",
      "state",
      "timestamp",
      "sessionId",
      "namespace",
    ]

    attributes.map((attrubute) => {
      expect(pixel).to.have.property(attrubute).eql(pixel[attrubute])
    })
  })
})

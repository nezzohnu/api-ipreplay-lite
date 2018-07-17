import "../../support/hooks"
import { User } from "app/models"

describe(__filename, () => {

  describe("shared", () => {

    describe(".find", async () => {

      describe("without args", async () => {
        let user1
        let user2

        beforeEach(async () => {
          user1 = await factory.create('user')
          user2 = await factory.create('user')
        })

        it('should return user', async () => {
          const users = await User.find()

          expect(users).containSubset([{ id: user1.id }])
          expect(users).containSubset([{ id: user2.id }])
          expect(users.count).to.eql(2)
        })
      })

      describe("filter by attr", async () => {
        let user1
        let user2

        beforeEach(async () => {
          user1 = await factory.create('user', { firstName: "firstName" })
          user2 = await factory.create('user', { firstName: "test" })
        })

        it('should return user', async () => {
          const users = await User.find({ firstName: "test" })

          expect(users).to.not.containSubset([{ id: user1.id }])
          expect(users).to.containSubset([{ id: user2.id }])
          expect(users.count).to.eql(1)
        })
      })

      describe("limit", async () => {
        let user1
        let user2
        let user3

        beforeEach(async () => {
          user1 = await factory.create('user')
          user2 = await factory.create('user')
          user3 = await factory.create('user')
        })

        it('should return one user', async () => {
          const users = await User.find({}, null, { limit: 1 })

          expect(users.length).to.eql(1)
        })
      })

    })

    describe(".findById", async () => {
      let user

      beforeEach(async () => {
        user = await factory.create('user')
      })

      it('should return user', async () => {
        user = await User.findById(user.id)
        expect(user.id).to.eql(user.id)
      })
    })

    describe(".findOne", async () => {
      let user1
      let user2

      beforeEach(async () => {
        user1 = await factory.create('user')
        user2 = await factory.create('user')
      })

      it('should return user by id', async () => {
        let user = await User.findOne({ id: user1.id })

        expect(user.id).to.eql(user1.id)
      })

      it('should return user by email', async () => {
        let user = await User.findOne({ email: user1.email })

        expect(user.id).to.eql(user1.id)
      })
    })

  })

  describe(".isEmailAlreadyExist", async () => {
    it('should return true', async () => {
      let user = await factory.create('user')

      let res = await User.isEmailAlreadyExist(user.email)

      expect(res).to.eql(true)
    })

    it('should return false', async () => {
      let res = await User.isEmailAlreadyExist("test@test.com")

      expect(res).to.eql(false)
    })
  })

})

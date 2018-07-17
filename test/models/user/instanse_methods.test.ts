import "../../support/hooks"
import { History, User } from "app/models"
import * as sinon from 'sinon'
// import * as sendEmail from "app/services/emails/send"

describe(__filename, () => {

  describe('#comparePassword', async () => {
    it('valid', async () => {
      let password = "SFXQlXYh5vbISyb"
      let user = await factory.create('user', { password: password })

      let res = await user.comparePassword(password)

      expect(res).to.be.true
    })

    it('wrong', async () => {
      let password = "SFXQlXYh5vbISyb"
      let user = await factory.create('user', { password: password })

      let res = await user.comparePassword("test")

      expect(res).to.be.false
    })
  })

  // describe('#isAdmin', async () => {
  //   it('valid', async () => {
  //     let user = await factory.create('user')

  //     let res = await user.isAdmin()

  //     expect(res).to.be.false
  //   })

  //   it('wrong', async () => {
  //     let user = await factory.create('userAdmin')

  //     let res = await user.isAdmin()

  //     expect(res).to.be.true
  //   })
  // })

  describe('#set', async () => {
    it('should set', async () => {
      const firstName = "123"

      let user = await factory.create('user')

      user.set({ firstName })
      await user.save()

      user = await User.findById(user.id)

      expect(user.firstName).to.eql(firstName)
    })
  })

  // describe('#addHistory', async () => {
  //   let user
  //   let history

  //   beforeEach(async () => {
  //     user = await factory.create('user')
  //     history = await factory.create('history')

  //     await user.addHistory(history)
  //     await user.addHistory(history)
  //   })

  //   it('should add user confirmHistories', async () => {
  //     expect(user.confirmHistories).to.eql([history.id])
  //   })

  //   it('should history.user user.id', async () => {
  //     expect(history.user).to.eql(user.id)
  //   })
  // })

  // describe('#confirmAction', async () => {
  //   const userAgent = "userAgent"
  //   const ip = "ip"

  //   let user
  //   let mockSend

  //   beforeEach(() => {
  //     mockSend = sinon.stub(sendEmail, 'default').returns(sinon.spy())
  //   })

  //   afterEach(() => {
  //     mockSend.restore()
  //   })

  //   beforeEach(async () => {
  //     user = await factory.create('user')
  //     await user.confirmAction({ userAgent, ip })
  //   })

  //   it('should set confirmEmail', async () => {
  //     expect(user.confirmEmail).to.eql(true)
  //   })

  //   it('should set confirmAttempts', async () => {
  //     expect(user.confirmAttempts).to.eql(1)
  //   })

  //   it('should set new history', async () => {
  //     let historyId = user.confirmHistories[0]
  //     const history = await History.findById(historyId)

  //     expect(history.userAgent).to.eql(userAgent)
  //     expect(history.ip).to.eql(ip)
  //   })

  //   it('should set send email', async () => {
  //     await user.confirmAction({ userAgent, ip })

  //     try {
  //       await user.confirmAction({ userAgent, ip })
  //     } catch (err) {

  //     }

  //     expect(mockSend.called).to.eql(true)
  //   })

  // })

  // describe('#sendConfirmEmail', async () => {
  //   let mockSend
  //   let user

  //   beforeEach(() => {
  //     mockSend = sinon.stub(sendEmail, 'default').returns(sinon.spy())
  //   })

  //   afterEach(() => {
  //     mockSend.restore()
  //   })

  //   beforeEach(async () => {
  //     user = await factory.create('user')

  //     await user.sendConfirmEmail()
  //   })

  //   it('should add user confirmHistories', async () => {
  //     expect(mockSend.called).to.eql(true)
  //   })
  // })

})

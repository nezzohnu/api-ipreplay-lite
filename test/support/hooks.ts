import { User, Pixel } from "app/models"
// import { History, Email, Campaign, Recipient, User, Company, Event, Log, Pixel } from "app/models"

// TODO
afterEach(async () => {
  const deleteAll = async (item) => { await item.delete() }

  const users = await User.find()
  await Promise.all(users.map(deleteAll))

  // const companies = await Company.find()
  // await Promise.all(companies.map(deleteAll))

  // const events = await Event.find()
  // await Promise.all(events.map(deleteAll))

  // const logs = await Log.find()
  // await Promise.all(logs.map(deleteAll))

  // const recipients = await Recipient.find()
  // await Promise.all(recipients.map(deleteAll))

  // const campaigns = await Campaign.find()
  // await Promise.all(campaigns.map(deleteAll))

  // const emails = await Email.find()
  // await Promise.all(emails.map(deleteAll))

  // const histories = await History.find()
  // await Promise.all(histories.map(deleteAll))

  const pixels = await Pixel.find()
  await Promise.all(pixels.map(deleteAll))
})

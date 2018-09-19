import { User, Pixel } from "app/models"

// TODO
afterEach(async () => {
  const deleteAll = async (item) => { await item.delete() }

  const users = await User.find()
  await Promise.all(users.map(deleteAll))

  const pixels = await Pixel.find()
  await Promise.all(pixels.map(deleteAll))
})

import factory from './factory'

const createRoot = async () => {
  await factory.create('user', {
    email: "user@test.com",
    password: "12345"
  })
}

const main = async (): Promise<void> => {
  try {
    await createRoot()

    console.log("models created")
  } catch (err) {
    console.log(err.stack)
  }

  process.exit()
}

main()

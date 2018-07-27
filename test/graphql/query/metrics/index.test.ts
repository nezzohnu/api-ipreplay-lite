import "../../../support/hooks"

const action = "user"
const query = `
  query($input: IdInput!) {
    user(input: $input) {
      user {
        ${matchers.userAttr}
      }
      namespace
    }
  }
`



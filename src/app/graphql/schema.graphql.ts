export default `

  type Query {

    me: User

    user(input: IdInput!): UserWithMeta
    users(input: PatinationInput): UsersWithMeta

    pixels(input: PixelsInput): PixelsWithMeta

    metrics(input: MetricsInput): MetricsWithMeta

    sessions(input: SessionsInput): SessionsWithMeta
  }

  type Mutation {
    createToken(input: CreateTokenInput!): Token
    confirm(input: ConfirmInput!): Message
    sendConfirm: Message

    updateMe(input: UpdateMeInput!): User
    updatePasswordMe(input: UpdatePasswordMeInput!): User
    deleteMe(input: DeleteMeInput!): User

    createUser(input: CreateUserInput!): UserWithMeta

    createPixels(input: CreatePixelsInput!): PixelsWithMeta
    createPixelsJob(input: CreatePixelsInput!): Message
  }

  type Subscription {

    subscribeToLogPixel(namespace: String!): PixelsWithMeta
      @aws_subscribe(mutations: ["createPixels"])

  }

  ### INPUT ###

  input IdInput {
    id: ID!
  }

  input PatinationInput {
    offset: String
    limit: String
  }

  ### MODELS INPUT ###

  input UserInput {
    id: ID!
  }

  input LogInput {
    namespace: String
    offset: String
    limit: String
  }

  input CreateTokenInput {
    email: String!
    password: String!
  }

  input ConfirmInput {
    code: String!
  }

  input UpdateMeInput {
    firstName: String
    lastName: String
    email: String
    acceptPrivacy: Boolean
    acceptExpiration: Boolean

    recipient: String
  }

  input UpdatePasswordMeInput {
    oldPassword: String!
    newPassword: String!
  }

  input DeleteMeInput {
    password: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    password: String!
    email: String!
    acceptPrivacy: Boolean
    acceptExpiration: Boolean

    recipient: String
  }

  input UpdateUserInput {
    id: ID!
    firstName: String
    lastName: String
    phone: String
    publicKey: String
    deleteUser: Boolean
    acceptPrivacy: Boolean
    acceptExpiration: Boolean
    email: String
    emailStatus: String
    confirmEmail: Boolean
    confirmAttempts: String
    confirmCode: String
    password: String
    role: String
    recipient: String
  }

  input SubscriptionInput {
    namespace: String
    token: String
  }

  input MetricsInput {
    lastKey: String
    limit: String
    endTime: String
    startTime: String
  }

  input SessionsInput {
    lastKey: String
    limit: String
    endTime: String
    startTime: String
  }

  input PixelsInput {
    logStreamName: String!
    limit: String
    lastKey: String
    offset: String
  }

  input CreatePixelsInput {
    lastKey: String
    logStreamName: String
    pixels: [CreatePixelInput]
    meta: CreatePixelsMetaInput
  }

  input CreatePixelsMetaInput {
    state: String
    timestamp: String
    sessionId: String
  }

  input CreatePixelInput {
    event: String
    typeEvent: String
    timing: String
    level: String
    payload: String
  }

  ### MAIN MODELS ###

  type User {
    id: ID

    firstName: String
    lastName: String
    email: String
    acceptPrivacy: Boolean
    acceptExpiration: Boolean
    publicKey: String
    role: String
    recipient: String
    namespace: String

    createdAt: String
    updatedAt: String
  }

  ### SUPPORT MODELS ###

  type Total {
    total: Float!
  }

  type Token {
    token: String
    publicKey: String
    namespace: String
  }

  type Message {
    value: String!
    lastKey: String
    logStreamName: String
    namespace: String
  }

  type Meta {
    namespace: String
    limit: String
    offset: String
    total: String
  }

  type Pixel {
    id: ID

    event: String
    typeEvent: String
    level: String
    timing: String
    payload: String
    state: String
    timestamp: String
    sessionId: String
    namespace: String

    createdAt: String
    updatedAt: String
  }

  type MetricNetworkLatency {
    label: String
    metric: String
  }

  type MetricResourceLatency {
    label: String
    metric: String
  }

  type MetricDoms {
    label: String
    metric: String
  }

  type MetricUAProp {
    name: String
    version: String
  }


  type MetricUserAgent {
    count: String
    browser: MetricUAProp
    os: MetricUAProp
    engine: MetricUAProp
  }

  type MetricStates {
    pageLoad: [String]
    playerLoad: [String]
    mediaError: [String]
    mediaRequest: [String]
    mediaComplete: [String]
    mediaStart: [String]
    unload: [String]
  }

  type MetricMedia {
    count: String
    title: String
    description: String
    videoId: String
    isAd: String
    duration: String
  }

  type Session {
    timestamp: String
    sessionId: String
    userId: String
    logStreamName: String

    createdAt: String
    updatedAt: String
  }

  ### MODELS WITH META

  type UserWithMeta {
    user: User
    namespace: String
  }

  type UsersWithMeta {
    users: [User]
    namespace: String
    total: String
    lastKey: String
  }

  type MetricsWithMeta {
    networkLatency: [MetricNetworkLatency]
    resourceLatency: [MetricNetworkLatency]
    userAgents: [MetricUserAgent]
    medias: [MetricMedia]
    states: MetricStates
    doms: [MetricDoms]
    avePageload: String
    namespace: String
    total: String
    lastKey: String
  }

  type SessionsWithMeta {
    sessions: [Session]
    namespace: String
    total: String
    lastKey: String
  }

  type PixelsWithMeta {
    pixels: [Pixel]
    namespace: String
    total: String
    lastKey: String
  }

  ### SCHEMA ###

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

`

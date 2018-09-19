export default `

  type Query {

    me: User

    user(input: IdInput!): UserWithMeta
    users(input: PatinationInput): UsersWithMeta

    pixels(input: PixelsInput): PixelsWithMeta
    sessions(input: SessionsInput): SessionsWithMeta

    metricsBrowser(input: MetricsInput): MetricsWithMeta
    metricsLatency(input: MetricsInput): MetricsLatencyWithMeta
    metricsMedia(input: MetricsInput): MetricsWithMeta
    metricsSession(input: MetricsInput): MetricsWithMeta
    metricsOs(input: MetricsInput): MetricsWithMeta
    metricsError(input: MetricsInput): MetricsWithMeta
  }

  type Mutation {
    createToken(input: CreateTokenInput!): Token
    confirm(input: ConfirmInput!): Message
    sendConfirm: Message

    updateMe(input: UpdateMeInput!): User
    updatePasswordMe(input: UpdatePasswordMeInput!): User
    deleteMe(input: DeleteMeInput!): User

    createUser(input: CreateUserInput!): UserWithMeta

    deleteSessions(input: DeleteSessionsInput!): Message

    createPixels(input: CreatePixelsInput!): PixelsWithMeta
    createPixelsJob(input: CreatePixelsInput!): PixelsWithMeta
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

  input DeleteSessionsInput {
    logStreamNames: [String]
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
    video: String
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
    namespace: String
  }

  type Meta {
    namespace: String
    limit: String
    offset: String
    total: String
  }

  type Video {
    currentTime: String
    duration: String
    videoId: String
  }

  type Timing {
    duration: String
    startTime: String
    entryType: String
    name: String
  }

  type Pixel {
    id: ID

    event: String
    typeEvent: String
    level: String
    timing: Timing
    payload: String
    state: String
    video: Video
    timestamp: String
    sessionId: String
    namespace: String

    logStreamName: String

    createdAt: String
    updatedAt: String
  }

  type MetricData {
    updatedAt: String
    logStreamName: String
    pixel: Pixel
    createdAt: String
  }

  type Metrics {
    total: String,
    streamsSearched: String
    data: [[Pixel]]
    id: String
    label: String
  }

  type MetricLatency{
    name: String,
    duration: String
  }

  type MetricsLatency {
    total: String,
    data: [MetricLatency]
    id: String
    label: String
  }

  type Session {
    timestamp: String
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

  type MetricsLatencyWithMeta{
    data: [MetricsLatency]
    collections: String
    lastKey: String
  }

  type MetricsWithMeta{
    data: [Metrics]
    collections: String
    lastKey: String
  }

  type SessionsWithMeta {
    sessions: [Session]
    namespace: String
    total: String
    lastKey: String
  }

  type PixelsWithMeta {
    logStreamName: String
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

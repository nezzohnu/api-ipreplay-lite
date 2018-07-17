import * as bcrypt from "bcrypt-nodejs" // NOTE package bcrypt not with serverless node 6.1.0
import { v4 as uuid } from "uuid"
import { contains } from 'ramda'
import dynamoose from "config/dynamoose"
import { buildCode, validateEmail, normalizeEmail } from "app/services/utils"
import { addInstanseMethods, addStaticFinds } from "app/services/dynamoose"
// import sendEmail from "app/services/emails/send"
// import optionsRenderSupport from "app/services/emails/options_render_support"
// import optionsConfirmEmail from "app/services/emails/options_confirm_email"

const schema = new dynamoose.Schema({

  id: {
    type: String,
    default: uuid,
  },

  firstName: {
    unique: false,
    required: true,
    type: String,
  },

  lastName: {
    unique: false,
    required: true,
    type: String,
  },

  phone: {
    unique: false,
    required: false,
    type: String,
  },

  // NOTE delete invalid attribute, rename
  deleteUser: {
    unique: false,
    required: true,
    type: Boolean,
    default: false,
  },

  acceptPrivacy: {
    unique: false,
    required: true,
    type: Boolean,
    default: false
  },

  acceptExpiration: {
    unique: false,
    required: true,
    type: Boolean,
    default: false
  },

  email: {
    type: String,
    required: true,
    validate: validateEmail,
  },

  emailStatus: {
    type: String,
    trim: true,
    lowercase: false,
    required: false,
    default: 'wait'
  },

  confirmEmail: {
    type: Boolean,
    default: false,
  },

  confirmAttempts: {
    type: Number,
    default: 0,
  },

  confirmCode: {
    type: String,
    required: true,
    auto: true,
    unique: true,
    default: buildCode,
  },

  password: {
    unique: true,
    required: true,
    type: String,
    default: buildCode
  },

  namespace: {
    unique: true,
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true,
    default: "guest",
    enum: ["guest", "admin", "root"],
  },

  publicKey: {
    unique: true,
    type: String,
    default: uuid,
  },

}, {
    timestamps: true,
  })

addStaticFinds(schema)
addInstanseMethods(schema)

schema.statics.isEmailAlreadyExist = async function (email: string): Promise<boolean> {
  let validEmail = normalizeEmail(email)

  let user = await this.findOne({ email: validEmail })

  if (user) {
    return true
  }

  return false
}

schema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compareSync(candidatePassword, this.password)
}

schema.methods.isAdmin = function (): boolean {
  return this.role === "admin"
}

schema.methods.isRoot = function (): boolean {
  return this.role === "root"
}

schema.methods.addEmailStatus = async function (recipient: any): Promise<any> {
  this.emailStatus = recipient.status
  await this.save()

  return this
}

schema.methods.confirmAction = async function (): Promise<any> {

  await this.set({
    confirmEmail: true,
    confirmAttempts: this.confirmAttempts + 1
  })

  if (this.confirmAttempts > 2) {
    // await sendEmail(await optionsRenderSupport(this))
    throw new Error('Exceeded confirmation attempts. Please request a new confirmation email.')
  }

  await this.save()

  return this
}

schema.methods.sendConfirmEmail = async function (): Promise<any> {
  if (!this.email) throw new Error("user should have email")

  // return await sendEmail(await optionsConfirmEmail(this))
}

const Model = dynamoose.model('User', schema)

// NOTE hooks
Model.pre('save', async function (next: any): Promise<any> {
  this.email = normalizeEmail(this.email)

  if (!contains(this.emailStatus, ["wait", "success", "failures"])) {
    this.deleteUser = true
  }

  // TODO maybe dynamo db have check modifed
  // if (!this.isModified('password')) return next()

  if (!this.password) this.password = buildCode()
  this.password = await bcrypt.hashSync(this.password)

  return next()
})

Model.pre('save', async function (next: any): Promise<any> {
  if (!this.id) this.id = uuid()
  const id = this.id
  this.namespace = `urn:ipreplay:${id}`

  return next()
})

export default Model

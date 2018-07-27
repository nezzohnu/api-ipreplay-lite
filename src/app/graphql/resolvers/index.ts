import { createToken, confirm, sendConfirm } from "./auth"
import { me, updateMe, updatePasswordMe, deleteMe } from "./me"
import { users, user, createUser } from "./users"
import { subscribeToLogPixel } from "./subscribe"
import { pixels, sessions, createPixels, createPixelsJob } from "./pixels"
import { metrics } from "./metrics"
import { metrix } from "./metrix"

export default {

  Query: {
    me,

    user,
    users,

    pixels,
    metrics,
    metrix,
    sessions,
  },

  Mutation: {
    createToken,
    confirm,
    sendConfirm,

    updateMe,
    updatePasswordMe,
    deleteMe,

    createUser,

    createPixels,
    createPixelsJob,
  },

  Subscription: {
    subscribeToLogPixel
  },

}

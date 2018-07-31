import { createToken, confirm, sendConfirm } from "./auth"
import { me, updateMe, updatePasswordMe, deleteMe } from "./me"
import { users, user, createUser } from "./users"
import { subscribeToLogPixel } from "./subscribe"
import { pixels, sessions, createPixels, createPixelsJob } from "./pixels"
import { metricsBrowser, metricsError, metricsSession, metricsLatency, metricsMedia, metricsOs } from "./metric"

export default {

  Query: {
    me,

    user,
    users,

    pixels,
    sessions,

    metricsBrowser,
    metricsError,
    metricsLatency,
    metricsMedia,
    metricsOs,
    metricsSession
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

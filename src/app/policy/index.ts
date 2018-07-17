import * as CanCan from "cancan"
import { User, Pixel } from "app/models"

const initUser = (allow) => {
  allow(User, ["read", "update", "create", "delete"], User, (user, target, options) => {
    if (user.role === 'root') { return true }
    return false
  })
}


const initPixels = (allow) => {
  allow(User, "readAnyPixel", Pixel, (user, target, options) => {
    if (user.role === 'root') { return true }
    return false
  })
}

const initCancan = () => {
  const cancan = new CanCan()

  let { allow } = cancan

  initUser(allow)
  initPixels(allow)

  return cancan
}

const cancan = initCancan()
const { authorize, cannot, can } = cancan

export {
  authorize,
  cannot,
  can,
}

export default cancan

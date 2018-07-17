import { pick, merge, path } from "ramda"

export const params = (req, keys) => {
  let res = req.body

  Object.keys(res)
    .filter(key => !keys.includes(key))
    .forEach(key => delete res[key])

  return res
}

export const createFilterAttributes = (attrs) => {
  return pick(attrs)
}

export const getAttributes = (req) => {
  return path(["body", 'data', "attributes"], req) || {}
}

export const getFile = (req) => {
  return path(["files", 'file'], req) || {}
}

export const getAttributesSocket = (req) => {
  return path(['data', "attributes"], req) || {}
}

export const getId = (req) => {
  return path(["body", 'data', "id"], req)
}

export const getOptionsFind = (req: any): any => {
  const limit = parseInt(path(["query", 'page', "limit"], req)) || 15
  const startAtKey = path(["query", 'page', "offset"], req) || null
  let sort = path(["query", "sort"], req) || ""
  let startAt = null

  if (startAtKey) {
    startAt = { id: { S: startAtKey } }
  }

  return { limit, startAt }
}

export const getFields = (req, model) => {
  let res = path(["query", 'fields', model], req)

  if (res) return res.replace(/,/g, " ")
  return null
}

export const getInclude = (req) => {
  let included = req.query.include

  if (!included) return

  const options = included.split(",").reduce((acc, object) => {
    acc[object] = true
    return acc
  }, {})

  return options
}

export const getFilterRecipient = (req) => {
  let filter = path(['query', "filter"], req) || {}

  return Object.keys(filter).reduce((acc, object) => {
    if (object == "company") {
      acc = merge(acc, { company: new RegExp(filter.email, "i") })
    }


    if (object == "email") {
      acc = merge(acc, { email: new RegExp(filter.email, "i") })
    }

    if (object == "status") {
      acc = merge(acc, { status: new RegExp(filter.status, "i") })
    }

    return acc
  }, {})
}

export const getFilterCompany = (req) => {
  let filter = path(['query', "filter"], req) || {}

  return Object.keys(filter).reduce((acc, object) => {
    if (object == "company") {
      acc = merge(acc, { company: filter.company })
    }
    return acc
  }, {})
}

export const getOptionsSerializer = (req: any, total?: any): any => {
  let options
  let attributes = {}
  let included = req.query.include

  if (included) {
    options = included.split(",").reduce((acc, object) => {
      acc[object] = true
      return acc
    }, {})
  }

  return merge(options, { total, attributes })
}

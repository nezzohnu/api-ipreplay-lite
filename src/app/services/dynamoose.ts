export const addStaticFinds = (schema) => {

  schema.statics.findById = async function (id: string | number): Promise<any> {
    if (!id) throw new Error("id should be exist")
    let res = await this.queryOne({ id }).exec()

    return res || null
  }

  schema.statics.find = async function (query: any = {}, conditionalOperators: any = {}, options: any = {}) {
    options = options || {}

    let objects = this.scan(query, conditionalOperators)

    if (options.startAt) {
      objects.startAt(options.startAt)
    }

    if (options.limit) {
      objects.limit(options.limit)
    }

    return await objects.exec()
  }

  schema.statics.findOne = async function (query = {}, _ = null, options = {}) {
    let object = await this.scan(query).exec()
    return object[0] || null
  }

}

export const addInstanseMethods = (schema) => {

  schema.methods.set = async function (options = {}) {
    Object.keys(options).map((key) => { this[key] = options[key] })
  }

  schema.methods.remove = async function () {
    await this.delete()
  }

  schema.methods.update = async function (options = {}) {
    Object.keys(options).map((key) => { this[key] = options[key] })
    await this.save()
  }

  schema.methods.populatePath = async function (path: string): Promise<any> {
    let model

    if (path == "user") {
      model = "User"
    }

    if (path == "company") {
      model = "Company"
    }

    await this.populate({ path, model })
  }

}

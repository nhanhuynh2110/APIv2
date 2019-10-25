var ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  countDocument: (Model, query) => {
    try {
      Model.count(query, (error, count) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(count)
      })
    } catch (error) {
      return Promise.error(error)
    }
  },

  excuteQuery: (Model, query) => {
    try {
      return Model.find(query, (error, data) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(data)
      })
    } catch (error) {
      return Promise.error(error)
    }
  },

  findOneId: (Model, id) => {
    try {
      Model.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(data)
      })
    } catch (error) {
      return Promise.error(error)
    }
  },

  save: (Model, data) => {
    try {
      const modelSchema = new Model(data)
      modelSchema.save((error, resp) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(resp)
      })
    } catch (error) {
      return Promise.error(error)
    }
  },

  update: (Model, conditions, data) => {
    try {
      Model.findOneAndUpdate(conditions, data, {new: true}, (error, resp) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(resp)
      })
    } catch (error) {
      return Promise.error(error)
    }
  }
}

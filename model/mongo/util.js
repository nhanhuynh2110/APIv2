const ObjectId = require('mongoose').Types.ObjectId
const _ = require('lodash')

module.exports = {
  countDocument: (Model, query) => {
    try {
      return Model.count(query)
    } catch (error) { return Promise.reject(error) }
  },

  excuteQuery: (Model, query) => {
    try {
      return Model.find(query)
    } catch (error) { return Promise.reject(error) }
  },

  findOneId: (Model, id) => {
    try {
      return Model.findOne({_id: ObjectId(id)})
    } catch (error) { return Promise.reject(error) }
  },

  create: (Model, data) => {
    try {
      const modelSchema = new Model(data)
      return modelSchema.save()
    } catch (error) { return Promise.reject(error) }
  },

  update: (Model, conditions, data) => {
    try {
      return Model.findOneAndUpdate(conditions, data, {new: true})
    } catch (error) { return Promise.reject(error) }
  },

  deleteById: (Model, id) => {
    try {
      return Model.deleteOne({_id: ObjectId(id)})
    } catch (error) { return Promise.reject(error) }
  },

  calSkip: (pageSize, pageNumber) => {
    try {
      return parseInt(pageSize) * (parseInt(pageNumber) - 1)
    } catch (error) { return null }
  },

  formatSort: (column, sortType = 'asc') => {
    if (!column) return null
    return { [column]: sortType === 'asc' ? 1 : -1 }
  }
}

const async = require('async')
const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../helper/utility')
const {ProductMaster, Category} = require('../../model/mongo')

module.exports = () => {
  return {
    all: async ({ $search, sort, sortType, page, pageSize, isDelete }) => {
      let query = {}

      if ($search) query['$text'] = { $search }
      if (sort) query[sort] = sortType && sortType === 'asc' ? 1 : -1
      query.isDelete = isDelete === 'true'

      const count = await countDocument(query)
      return excuteQuery(list => {
        return { total: count, list }
      })
    },

    findId: (id) => {
      ProductMaster.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return Promise.reject(error)
        return Promise.resolve(data)
      })
    },

    create: (payload) => {
      return hadlePayloadForm(payload)
        .then(data => {
          const productMaster = new ProductMaster(data)
          productMaster.save((error, resp) => {
            if (error) return Promise.reject(error)
            return Promise.resolve(resp)
          })
        })
    },

    update: (payload, id) => {
      return hadlePayloadForm(payload)
        .then(data => {
          ProductMaster.findOneAndUpdate({ _id: ObjectId(id) }, data, {new: true}, (error, resp) => {
            if (error) return Promise.reject(error)
            return Promise.resolve(resp)
          })
        })
    }
  }
}

const countDocument = (query) => {
  ProductMaster.count(query, (error, count) => {
    if (error) return Promise.reject(error)
    return Promise.resolve(count)
  })
}

const hadlePayloadForm = (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  const categoryId = _.get(payload, 'categoryId')
  if (!categoryId) return Promise.resolve(payload)

  Category.findOne({ _id: ObjectId(categoryId) }, (error, cat) => {
    if (error) return Promise.reject(error)
    if (!cat) return Promise.reject(new Error('category invalid'))
    payload.categoryParentId = cat.parentId ? cat.parentId : categoryId
    return Promise.resolve(payload)
  })
}

const excuteQuery = (query) => {
  return ProductMaster.find(query, (error, data) => {
    if (error) return Promise.reject(error)
    return Promise.resolve(data)
  })
}

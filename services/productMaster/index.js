const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../helper/utility')
const {countDocument, excuteQuery, findOneId, save, update} = require('../../model/mongo/util')
const {ProductMaster, Category} = require('../../model/mongo')

module.exports = () => {
  return {
    all: async ({ $search, sort, sortType, page, pageSize, isDelete }) => {
      let query = {}
      if ($search) query['$text'] = { $search }
      if (sort) query[sort] = sortType && sortType === 'asc' ? 1 : -1
      query.isDelete = isDelete === 'true'
      const count = await countDocument(ProductMaster, query)
      return excuteQuery(ProductMaster, query).then(list => ({ total: count, list }))
    },

    findId: (id) => findOneId(ProductMaster, id),

    create: (payload) => {
      return hadlePayloadForm(payload).then(data => save(ProductMaster, data))
    },

    update: (payload, id) => {
      return hadlePayloadForm(payload).then(data => update(ProductMaster, { _id: ObjectId(id) }, data))
    }
  }
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

const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, excuteQuery, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {Product, Category} = require('../../model/mongo')

module.exports = {
  productDetail: async (id) => findOneId(Product, id),
  create: (payload) => hadlePayloadForm(payload).then(resp => create(Product, resp)),
  updateById: async (id, payload) => {
    const product = await findOneId(Product, id)
    if (!product) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(Product, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const product = await findOneId(Product, id)
    if (!product) return Promise.resolve(null)
    return deleteById(Product, id).then(() => product)
  },
  filter: ({$searchKey, isDelete, pageSize, pageNumber, colSort, typeSort}) => {
    const query = {}
    if ($searchKey) { query['$text'] = { $search: $searchKey } }
    query.isDelete = isDelete === 'true'
    const tasks = []
    tasks.push(() => countDocument(Product, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return excuteQuery(Product, query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  }
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  if (!payload.categoryId) return Promise.resolve(payload)
  const categoryId = _.get(payload, 'categoryId')
  if (!categoryId) return Promise.resolve(payload)
  const cate = await findOneId(Category, categoryId)

  if (!cate) return Promise.reject(new Error('category not exist!!!'))
  payload.categoryParentId = cate.parentId ? cate.parentId : categoryId
  return Promise.resolve(payload)
}

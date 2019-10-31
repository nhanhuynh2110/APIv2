const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, excuteQuery, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {ProductMaster, Category} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(ProductMaster, id),
  create: (payload) => hadlePayloadForm(payload).then(resp => create(ProductMaster, resp)),
  updateById: async (id, payload) => {
    const product = await findOneId(ProductMaster, id)
    if (!product) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(ProductMaster, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const product = await findOneId(ProductMaster, id)
    if (!product) return Promise.resolve(null)
    return deleteById(ProductMaster, id).then(() => product)
  },
  filter: ({$searchKey, isDelete, pageSize, pageNumber, colSort, typeSort}) => {
    const query = {}
    if ($searchKey) {
      query['$text'] = { $search: $searchKey, $caseSensitive: true, $diacriticSensitive: true }
    }
    query.isDelete = isDelete === 'true'
    const tasks = []
    tasks.push(() => countDocument(ProductMaster, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return excuteQuery(ProductMaster, query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getProductActive: () => excuteQuery(ProductMaster, {isActive: true, isDelete: false})
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

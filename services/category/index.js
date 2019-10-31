const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {Category} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(Category, id),
  create: (payload) => {
    if (!payload.parentId) payload.parentId = null
    return hadlePayloadForm(payload).then(resp => create(Category, resp))
  },
  updateById: async (id, payload) => {
    const cat = await findOneId(Category, id)
    if (!cat) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(Category, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const cat = await findOneId(Category, id)
    if (!cat) return Promise.resolve(null)
    return deleteById(Category, id).then(() => cat)
  },
  filter: ({$searchKey, level, isDelete, pageSize, pageNumber, colSort, typeSort}) => {
    const query = {}
    if ($searchKey) {
      query['$text'] = { $search: $searchKey, $caseSensitive: true, $diacriticSensitive: true }
    }
    query.isDelete = isDelete === 'true'
    if (level === 'parent') query.parentId = null
    if (level === 'children') query.parentId = { $ne: null }
    const tasks = []
    tasks.push(() => countDocument(Category, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return Category.find(query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getParents: () => Category.find({isActive: true, isDelete: false, parentId: null}),
  getCategoryActive: () => Category.find({isActive: true, isDelete: false}),
  updateOrderNumber: async (id, number) => {
    const criteria = {
      _id: {$ne: ObjectId(id)},
      parentId: { $exists: false },
      order: {$gte: parseInt(number)}
    }

    const catExistNum = await Category.findOne({ order: parseInt(number), _id: {$ne: ObjectId(id)} })
    const catById = await Category.findOne({ _id: ObjectId(id) })

    if (!catById) return Promise.reject(new Error('category not found'))

    const categories = await Category.find(criteria)
    let tasks = []
    if (categories && catExistNum) {
      tasks = categories.map((item) => {
        const order = item.order + 1
        return Category.update({'_id': item._id}, {'$set': { 'order': order }})
      })
    }

    tasks.push(Category.update({'_id': catById._id}, {'$set': { 'order': parseInt(number) }}))
    return Promise.all(tasks)
  }
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  return Promise.resolve(payload)
}

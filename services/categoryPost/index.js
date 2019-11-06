const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {CategoryPost} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(CategoryPost, id),
  create: (payload) => {
    if (!payload.parentId) payload.parentId = null
    return hadlePayloadForm(payload).then(resp => create(CategoryPost, resp))
  },
  updateById: async (id, payload) => {
    const cat = await findOneId(CategoryPost, id)
    if (!cat) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(CategoryPost, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const cat = await findOneId(CategoryPost, id)
    if (!cat) return Promise.resolve(null)
    return deleteById(CategoryPost, id).then(() => cat)
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
    tasks.push(() => countDocument(CategoryPost, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return CategoryPost.find(query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getParents: () => CategoryPost.find({isActive: true, isDelete: false, parentId: null}),
  getCategoryPostActive: () => CategoryPost.find({isActive: true, isDelete: false}),
  updateOrderNumber: async (id, number) => {
    const criteria = {
      _id: {$ne: ObjectId(id)},
      parentId: { $exists: false },
      order: {$gte: parseInt(number)}
    }

    const catExistNum = await CategoryPost.findOne({ order: parseInt(number), _id: {$ne: ObjectId(id)} })
    const catById = await CategoryPost.findOne({ _id: ObjectId(id) })

    if (!catById) return Promise.reject(new Error('CategoryPost not found'))

    const categoryPosts = await CategoryPost.find(criteria)
    let tasks = []
    if (categoryPosts && catExistNum) {
      tasks = categoryPosts.map((item) => {
        const order = item.order + 1
        return CategoryPost.update({'_id': item._id}, {'$set': { 'order': order }})
      })
    }

    tasks.push(CategoryPost.update({'_id': catById._id}, {'$set': { 'order': parseInt(number) }}))
    return Promise.all(tasks)
  }
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  return Promise.resolve(payload)
}

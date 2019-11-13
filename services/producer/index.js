const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {Producer} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(Producer, id),
  create: (payload) => {
    if (!payload.parentId) payload.parentId = null
    return hadlePayloadForm(payload).then(resp => create(Producer, resp))
  },
  updateById: async (id, payload) => {
    const producer = await findOneId(Producer, id)
    if (!producer) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(Producer, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const producer = await findOneId(Producer, id)
    if (!producer) return Promise.resolve(null)
    return deleteById(Producer, id).then(() => producer)
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
    tasks.push(() => countDocument(Producer, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return Producer.find(query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getParents: () => Producer.find({isActive: true, isDelete: false, parentId: null}),
  getProducerActive: () => Producer.find({isActive: true, isDelete: false}),
  updateOrderNumber: async (id, number) => {
    const criteria = {
      _id: {$ne: ObjectId(id)},
      parentId: { $exists: false },
      order: {$gte: parseInt(number)}
    }

    const producerExistNum = await Producer.findOne({ order: parseInt(number), _id: {$ne: ObjectId(id)} })
    const producerById = await Producer.findOne({ _id: ObjectId(id) })

    if (!producerById) return Promise.reject(new Error('Producer not found'))

    const producers = await Producer.find(criteria)
    let tasks = []
    if (producers && producerExistNum) {
      tasks = producers.map((item) => {
        const order = item.order + 1
        return Producer.update({'_id': item._id}, {'$set': { 'order': order }})
      })
    }

    tasks.push(Producer.update({'_id': producerById._id}, {'$set': { 'order': parseInt(number) }}))
    return Promise.all(tasks)
  }
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  return Promise.resolve(payload)
}

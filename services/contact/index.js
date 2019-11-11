const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {Contact} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(Contact, id),
  updateById: async (id, payload) => {
    const cat = await findOneId(Contact, id)
    if (!cat) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(Contact, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const cat = await findOneId(Contact, id)
    if (!cat) return Promise.resolve(null)
    return deleteById(Contact, id).then(() => cat)
  },
  filter: ({$searchKey, level, isDelete, pageSize, pageNumber, colSort, typeSort}) => {
    const query = {}
    if ($searchKey) {
      query['$text'] = { $search: $searchKey, $caseSensitive: true, $diacriticSensitive: true }
    }
    query.isDelete = isDelete === 'true'
    const tasks = []
    tasks.push(() => countDocument(Contact, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return Contact.find(query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getContactActive: () => Contact.find({isActive: true, isDelete: false})
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  return Promise.resolve(payload)
}

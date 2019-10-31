const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId
const utility = require('../../helper/utility')
const {countDocument, findOneId, create, update, deleteById, calSkip, formatSort} = require('../../model/mongo/util')
const {Post, CategoryPost} = require('../../model/mongo')

module.exports = {
  detail: async (id) => findOneId(Post, id),
  create: (payload) => {
    if (!payload.parentId) payload.parentId = null
    return hadlePayloadForm(payload).then(resp => create(Post, resp))
  },
  updateById: async (id, payload) => {
    const cat = await findOneId(Post, id)
    if (!cat) return Promise.resolve(null)
    return hadlePayloadForm(payload).then(resp => update(Post, {_id: ObjectId(id)}, resp))
  },
  deleteById: async (id) => {
    const cat = await findOneId(Post, id)
    if (!cat) return Promise.resolve(null)
    return deleteById(Post, id).then(() => cat)
  },
  filter: ({$searchKey, isDelete, pageSize, pageNumber, colSort, typeSort}) => {
    const query = {}
    if ($searchKey) {
      query['$text'] = { $search: $searchKey, $caseSensitive: true, $diacriticSensitive: true }
    }
    query.isDelete = isDelete === 'true'
    const tasks = []
    tasks.push(() => countDocument(Post, query).then(count => count))
    tasks.push(() => {
      const skip = calSkip(pageSize, pageNumber)
      const sort = formatSort(colSort, typeSort)
      return Post.find(query).skip(skip).limit(parseInt(pageSize)).sort(sort)
    })
    return utility.runParrallel(tasks).then(data => ({
      total: data[0],
      list: data[1]
    }))
  },
  getPostActive: () => excuteQuery(Post, {isActive: true, isDelete: false})
}

const hadlePayloadForm = async (payload) => {
  if (payload.title) payload.link = utility.formatLink(payload.title)
  if (!payload.categoryPostId) return Promise.resolve(payload)
  const categoryPostId = _.get(payload, 'categoryPostId')
  if (!categoryPostId) return Promise.resolve(payload)
  const catePost = await findOneId(CategoryPost, categoryPostId)

  if (!catePost) return Promise.reject(new Error('category post not exist!!!'))
  payload.categoryPostParentId = catePost.parentId ? catePost.parentId : categoryPostId
  return Promise.resolve(payload)
}
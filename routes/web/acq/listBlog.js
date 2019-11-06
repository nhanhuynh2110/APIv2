const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Post, CategoryPost } = Models

module.exports = (router) => {
  router.get('/list-blog', (req, res) => {
    try {
      const { page, qcat, pageSize = 10 } = req.query
      const categoryPost = (cb) => CategoryPost.findOne({ link: qcat }, cb)

      const categoryPostChildren = (categoryPostData, cb) => {
        CategoryPost.find({ isActive: true, isDelete: false, parentId: categoryPostData.parentId}, (err, categoryPosts) => {
          if (err) return cb(err)
          return cb(null, categoryPostData, categoryPosts)
        })
      }
      let skip = parseInt(pageSize) * (parseInt(page) - 1)
      const postsData = (categoryPostData, categoryPosts, cb) => {
        if (!categoryPostData) return cb(null, [])
        const query = { isActive: true, isDelete: false, categoryPostId: ObjectId(categoryPostData._id) }
        const posts = (callback) => Post.find(query, callback).skip(skip).limit(parseInt(pageSize))
        const total = (callback) => Post.count(query).then(count => callback(null, count)).catch(err => callback(err))

        async.parallel({posts, total}, (err, data) => {
          if (err) return cb(err)
          const {posts, total} = data
          return cb(null, { posts, total, categoryPosts, categoryPost: categoryPostData})
        })
      }

      async.waterfall([ categoryPost, categoryPostChildren, postsData ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

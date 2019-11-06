const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Post, CategoryPost } = Models

module.exports = (router) => {
  router.get('/detail-blog', (req, res) => {
    try {
      const { id } = req.query

      const post = (cb) => {
        Post.findOne({ isActive: true, isDelete: false, _id: ObjectId(id) }, cb)
      }

      const categoryPost = (post, cb) => {
        CategoryPost.findOne({ _id: ObjectId(post.categoryPostId) }, (err, cat) => {
          if (err) return cb(err)
          return cb(null, post, cat)
        })
      }

      const catPChildren = (post, categoryPostData, cb) => {
        CategoryPost.find({ isActive: true, isDelete: false, parentId: categoryPostData.parentId}, (err, categoryPosts) => {
          if (err) return cb(err)
          return cb(null, { post, category: categoryPostData, categoryPosts })
        })
      }

      async.waterfall([ post, categoryPost, catPChildren ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

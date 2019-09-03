const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Post, Category } = Models

module.exports = (router) => {
  router.get('/list', (req, res) => {
    try {
      const { page, qcat } = req.query
      const category = (cb) => {
        Category.findOne({ link: qcat }, cb)
      }
      let pageSize = 2
      let skip = pageSize * (parseInt(page) - 1)
      const posts = (categoryData, cb) => {
        if (!categoryData) return cb(null, [])
        Post.find({ isActive: true, isDelete: false, categoryPostId: ObjectId(categoryData._id) }, cb).skip(skip).limit(pageSize)
      }

      async.waterfall([ category, posts ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

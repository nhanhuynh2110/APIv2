const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Post } = Models

module.exports = (router) => {
  router.get('/detail', (req, res) => {
    try {
      const { id } = req.query
      const posts = (cb) => {
        Post.findOne({ isActive: true, isDelete: false, _id: ObjectId(id) }, cb)
      }

      async.waterfall([ posts ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

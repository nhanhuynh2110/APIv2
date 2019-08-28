const async = require('async')

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Post } = Models

module.exports = (router) => {
  router.get('/list', (req, res) => {
    try {

      
      const { page, qcat } = req.query
      let pageSize = 2
      let skip = pageSize * (parseInt(page) - 1)
      const posts = (cb) => {
        Post.find({ isActive: true, isDelete: false, categoryPostId: qcat }, (err, posts) => {
          return cb(err, posts)
        }).skip(skip).limit(pageSize)
      }

      async.parallel({ posts }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

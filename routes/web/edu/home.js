const async = require('async')

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Category, Post } = Models

module.exports = (router) => {
  router.get('/menu', (req, res) => {
    try {
      const menu = (cb) => {
        Category.find({ isActive: true, isDelete: false }, (err, categories) => {
          return cb(err, categories)
        })
      }

      async.parallel({ menu }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/homepage', (req, res) => {
    try {
      const posts = (cb) => {
        Post.find({ isActive: true, isDelete: false }, (err, posts) => {
          return cb(err, posts)
        })
      }

      async.parallel({ posts }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

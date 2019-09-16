const async = require('async')

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Category, Product, Gallery } = Models

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
      const categories = (cb) => {
        Category.find({ isActive: true, isDelete: false }, (err, categories) => {
          return cb(err, categories)
        })
      }
      const productsNew = (cb) => {
        Product.find({ isActive: true, isDelete: false, isNewProduct: true }, (err, posts) => {
          return cb(err, posts)
        }).limit(12)
      }

      const productsHot = (cb) => {
        Product.find({ isActive: true, isDelete: false, isHot: true }, (err, posts) => {
          return cb(err, posts)
        }).limit(12)
      }

      const galleries = (cb) => {
        Gallery.find({ isActive: true, isDelete: false }, (err, galleries) => {
          return cb(err, galleries)
        }).sort({createDate: -1}).limit(21)
      }

      async.parallel({ categories, productsNew, productsHot, galleries }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

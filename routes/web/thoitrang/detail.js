const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Product, Category } = Models

module.exports = (router) => {
  router.get('/detail', (req, res) => {
    try {
      const { id } = req.query

      const product = (cb) => {
        Product.findOne({ isActive: true, isDelete: false, _id: ObjectId(id) }, cb)
      }

      const category = (product, cb) => {
        Category.findOne({ _id: ObjectId(product.categoryId) }, (err, cat) => {
          if (err) return cb(err)
          return cb(null, product, cat)
        })
      }

      const catChildren = (product, categoryData, cb) => {
        Category.find({ isActive: true, isDelete: false, parentId: categoryData.parentId}, (err, categories) => {
          if (err) return cb(err)
          return cb(null, { product, category: categoryData, categories })
        })
      }

      const productsHot = (data, cb) => {
        Product.find({ isActive: true, isDelete: false, isHot: true }, (err, products) => {
          return cb(err, {...data, productsHot: products})
        }).limit(12)
      }

      const productsNew = (data, cb) => {
        Product.find({ isActive: true, isDelete: false, isNewProduct: true }, (err, products) => {
          return cb(err, {...data, productsNew: products})
        }).limit(12)
      }

      async.waterfall([ product, category, catChildren, productsHot, productsNew ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

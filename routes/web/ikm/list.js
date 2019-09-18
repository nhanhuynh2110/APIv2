const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Product, Category } = Models

module.exports = (router) => {
  router.get('/list', (req, res) => {
    try {
      const { page, qcat } = req.query
      const category = (cb) => {
        Category.findOne({ link: qcat }, cb)
      }

      const categoryChildren = (categoryData, cb) => {
        Category.find({ isActive: true, isDelete: false, parentId: categoryData.parentId}, (err, categories) => {
          if (err) return cb(err)
          return cb(null, categoryData, categories)
        })
      }

      let pageSize = 10
      let skip = pageSize * (parseInt(page) - 1)
      const productsData = (categoryData, categories, cb) => {
        if (!categoryData) return cb(null, [])
        Product.find({ isActive: true, isDelete: false, categoryId: ObjectId(categoryData._id) }, (err, products) => {
          if (err) return cb(err)
          return cb(null, { products, categories, category: categoryData})
        }).skip(skip).limit(pageSize)
      }

      async.waterfall([ category, categoryChildren, productsData ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

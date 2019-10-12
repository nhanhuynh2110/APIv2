const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Product, Category } = Models

module.exports = (router) => {
  router.get('/list', (req, res) => {
    try {
      const { page, qcat, pageSize = 10 } = req.query
      const category = (cb) => {
        Category.findOne({ link: qcat }, cb)
      }

      const categoryChildren = (categoryData, cb) => {
        if (!categoryData) return cb(new Error('category is invalid'))
        Category.find({ isActive: true, isDelete: false, parentId: categoryData.parentId}, (err, categories) => {
          if (err) return cb(err)
          return cb(null, categoryData, categories)
        })
      }
      let skip = parseInt(pageSize) * (parseInt(page) - 1)
      const productsData = (categoryData, categories, cb) => {
        if (!categoryData) return cb(null, [])
        const query = { isActive: true, isDelete: false, categoryId: ObjectId(categoryData._id) }
        const products = (callback) => Product.find(query, callback).skip(skip).limit(parseInt(pageSize))
        const total = (callback) => Product.count(query).then(count => callback(null, count)).catch(err => callback(err))

        async.parallel({products, total}, (err, data) => {
          if (err) return cb(err)
          const {products, total} = data
          return cb(null, { products, total, categories, category: categoryData})
        })
      }

      async.waterfall([ category, categoryChildren, productsData ], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

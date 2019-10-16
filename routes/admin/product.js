var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId

var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {Product, Category, ProductSize} = Models

module.exports = function (router) {
  router.get('/products', (req, res) => {
    try {
      Product.find({ isActive: true, isDelete: false }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/product', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Product.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Product.find(query, (err, products) => cb(err, products)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/product/:id', (req, res) => {
    try {
      let {id} = req.params
      Product.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/product', (req, res) => {
    try {
      let dt = req.body
      dt['link'] = dt['title'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/[ ]/g, '-').toLowerCase()
      let categoryId = dt['categoryId']
      const getParentId = (cb) => {
        Category.findOne({ _id: ObjectId(categoryId) }, (err, cat) => {
          if (err) return cb(err)
          if (!cat) return cb(new Error('category invalid'))
          if (cat.parentId) return cb(null, cat.parentId)
          else return cb(null, categoryId)
        })
      }

      const createProduct = (parentId, cb) => {
        dt['categoryParentId'] = parentId
        let product = new Product(dt)
        var error = product.validateSync()

        if (error) {
          var errorKeys = Object.keys(error.errors)
          return cb(error.errors[errorKeys[0].message].toString())
        }

        product.save((err, data) => {
          if (err) cb(err.toString())
          return cb(null, data)
        })
      }

      async.waterfall([getParentId, createProduct], (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/product/:id', (req, res) => {
    try {
      let field = req.body
      if (field['title']) field['link'] = field['title'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/[ ]/g, '-').toLowerCase()
      delete field.id

      const getParentId = (cb) => {
        if (field['categoryId']) {
          Category.findOne({ _id: ObjectId(field['categoryId']) }, (err, cat) => {
            if (err) return cb(err)
            if (!cat) return cb(new Error('category invalid'))
            let parentId = cat.parentId ? cat.parentId : field['categoryId']
            field['categoryParentId'] = parentId
            return cb(null, field)
          })
        } else {
          return cb(null, field)
        }

      }

      const updateProduct = (dataUpdate, cb) => {
        Product.findOneAndUpdate({ _id: ObjectId(req.params.id) }, dataUpdate, {new: true}, (err, data) => {
          if (err) return cb(err.toString())
          return cb(null, data)
        })
      }

      async.waterfall([getParentId, updateProduct], (error, data) => {
        if (error) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/product/:id', (req, res) => {
    try {
      var { id } = req.params
      Product.deleteOne({_id: ObjectId(id)}, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

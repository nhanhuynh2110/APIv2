var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId

var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {Category} = Models

module.exports = function (router) {
  router.get('/category/parent', (req, res) => {
    try {
      Category.find({ isActive: true, isDelete: false, parentId: null }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })

  router.get('/categories', (req, res) => {
    try {
      Category.find({ isActive: true, isDelete: false }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/category', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Category.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Category.find(query, (err, categories) => cb(err, categories)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/category/:id', (req, res) => {
    try {
      let {id} = req.params
      Category.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/category', (req, res) => {
    try {
      let dt = req.body
      dt['link'] = dt['title'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/[ ]/g, '-').toLowerCase()
      let category = new Category(dt)
      var error = category.validateSync()

      if (error) {
        var errorKeys = Object.keys(error.errors)
        return utility.apiResponse(res, 500, error.errors[errorKeys[0].message].toString())
      }

      category.save((err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/category/:id', (req, res) => {
    try {
      let field = req.body
      if (field['title']) field['link'] = field['title'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/[ ]/g, '-').toLowerCase()
      delete field.id

      console.log('field', field)
      Category.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.put('/category/:id/order/:number', (req, res) => {
    try {
      const {id, number} = req.params

      if (typeof parseInt(number) !== 'number') return utility.apiResponse(res, 500, 'number invalid')

      const criteria = {
        _id: {$ne: ObjectId(id)},
        parentId: { $exists: false },
        order: {$gte: parseInt(number)}
      }

      const findCatNumberExits = (cb) => {
        Category.findOne({ order: parseInt(number), _id: {$ne: ObjectId(id)} }, (err, data) => {
          if (err) return cb(err)
          return cb(null, data)
        })
      }

      const findRowById = (catExistNum, cb) => {
        Category.findOne({ _id: ObjectId(id) }, (err, data) => {
          if (err) return cb(err)
          if (!data) return cb(new Error('category not found'))
          return cb(null, catExistNum, data)
        })
      }

      const categories = (catExistNum, rowPrimary, cb) => {
        Category.find(criteria, (err, cats) => cb(err, catExistNum, rowPrimary, cats))
      }

      const updates = (catExistNum, rowPrimary, cats, cb) => {
        let updatesRows = []
        if (cats && catExistNum) {
          updatesRows = cats.map((item) => {
            const order = item.order + 1
            return Category.update({'_id': item._id}, {'$set': { 'order': order }})
          })
        }
        updatesRows.push(Category.update({'_id': rowPrimary._id}, {'$set': { 'order': parseInt(number) }}))
        Promise.all(updatesRows)
          .then((results) => {
            return cb(null, results)
          })
          .catch(cb)
      }

      async.waterfall([findCatNumberExits, findRowById, categories, updates], (err, resp) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/category/:id', (req, res) => {
    try {
      var { id } = req.params
      Category.deleteOne({_id: ObjectId(id)}, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId

var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')
const {Category} = Models

module.exports = function (router) {
  router.get('/category', authUser.checkTokenAdmin, (req, res) => {
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

  router.get('/category/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {id} = req.params
      Category.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/category', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {body} = req
      let {title, isActive, isHome} = body
      let category = new Category({
        title,
        isActive,
        isHome,
        isDelete: false
      })
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

  router.put('/category/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      let field = req.body
      delete field.id
      Category.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/category/:id', authUser.checkTokenAdmin, (req, res) => {
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

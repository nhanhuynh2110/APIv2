var async = require('async')
var sha256 = require('sha256')
var ObjectId = require('mongoose').Types.ObjectId
var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {User} = Models

module.exports = (router) => {
  router.get('/user', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {master: false}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        User.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        User.find(query, (err, users) => cb(err, users)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) {
      return utility.apiResponse(res, 500, error.toString())
    }
  })
  router.get('/user/:id', (req, res) => {
    try {
      let {id} = req.params
      User.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })
  router.post('/user', (req, res) => {
    try {
      let dt = req.body
      dt['password'] = sha256(dt['password'])
      let user = new User(dt)
      var error = user.validateSync()

      if (error) {
        var errorKeys = Object.keys(error.errors)
        return utility.apiResponse(res, 500, error.errors[errorKeys[0].message].toString())
      }

      user.save((err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })
  router.put('/user/:id', (req, res) => {
    try {
      let field = req.body
      field['password'] = sha256(field['password'])
      delete field.id
      User.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })
  router.delete('/user/:id', (req, res) => {
    try {
      var { id } = req.params
      User.deleteOne({_id: ObjectId(id), master: false}, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

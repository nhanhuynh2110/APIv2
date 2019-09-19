const async = require('async')
const _ = require('lodash')
const ObjectId = require('mongoose').Types.ObjectId

const utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {PermissionDefine} = Models

module.exports = function (router) {
  router.get('/permissions-define', (req, res) => {
    try {
        PermissionDefine.find({ isActive: true, isDelete: false }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/permission-define', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        PermissionDefine.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        PermissionDefine.find(query, (err, permissionsDefine) => cb(err, permissionsDefine)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/permission-define/:id/childrens', (req, res) => {
    try {
      let {id} = req.params
      PermissionDefine.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data.children)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.get('/permission-define/:id', (req, res) => {
    try {
      let {id} = req.params
      PermissionDefine.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/permission-define', (req, res) => {
    try {
      let dt = _.clone(req.body)
      if (!dt.title) return utility.apiResponse(res, 500, 'title invalid !!!!')
      if (dt.title.includes(' ')) return utility.apiResponse(res, 500, 'title invalid !!!!')
      const checkExist = (cb) => {
        PermissionDefine.findOne({ title: dt.title.trim()}, (err, data) => {
          if (err) return cb(err)
          if (data) return cb('title is exist !!!')
          return cb()
        })
      }

      const create = (cb) => {
        let permissionDefine = new PermissionDefine(dt)
        var error = permissionDefine.validateSync()

        if (error) {
          var errorKeys = Object.keys(error.errors)
          return cb(error.errors[errorKeys[0].message].toString())
        }

        permissionDefine.save((err, data) => {
          if (err) return cb(err.toString())
          return cb(null, data)
        })
      }

      async.waterfall([checkExist, create], (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/permission-define/:id', (req, res) => {
    try {
      let field = req.body

      if (field.title && field.title.includes(' ')) return utility.apiResponse(res, 500, 'title invalid !!!!')
      delete field.id

      // _id: {$ne: ObjectId(id)},
      const checkExist = (cb) => {
        if (!field.title) return cb()
        PermissionDefine.findOne({ title: field.title.trim(), _id: { $ne: ObjectId(req.params.id) }}, (err, data) => {
          if (err) return cb(err)
          if (data) return cb('title is exist !!!')
          return cb()
        })
      }
      const update = (cb) => PermissionDefine.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, cb)

      async.waterfall([checkExist, update], (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/permission-define/:id', (req, res) => {
    try {
      var { id } = req.params
      PermissionDefine.deleteOne({_id: ObjectId(id)}, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

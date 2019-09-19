var async = require('async')
const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId

var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {Permission, PermissionDefine} = Models

module.exports = function (router) {
  router.get('/permissions', (req, res) => {
    try {
        Permission.find({ isActive: true, isDelete: false }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/permission', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Permission.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Permission.find(query, (err, permissions) => cb(err, permissions)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/permission/:id', (req, res) => {
    try {
      let {id} = req.params
      Permission.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/permission', (req, res) => {
    try {
      let dt = _.clone(req.body)

      if (!dt.children) return utility.apiResponse(res, 500, 'Children invalid !!!')

      const childrens = dt.children
      const permissionDefineKeys = Object.keys(childrens)

      const checkKeysDefine = (cb) => {
        PermissionDefine.find({}, (err, data) => {
          if (err) return cb(err)
          const titles = data.map(el => el.title)
          const isCheck = _.difference(permissionDefineKeys, titles).length <= 0
          if (!isCheck) return cb(new Error('key invalid!!!'))
          return cb(null, data)
        })
      }

      const checkKeysDefineChildren = (defines, cb) => {
        const childs = []
        let keyInvalid = ''
        const valid = permissionDefineKeys.every(element => {
          const item = defines.find(el => el.title === element)
          let isCheck = _.difference(childrens[element], item.children).length <= 0
          if (isCheck) {
            childrens[element].forEach(child => {
              childs.push(item.title + child)
            })
          } else {
            keyInvalid = element
          }
          return isCheck
        })

        if (!valid) return cb(new Error(`permission of ${keyInvalid} invalid`))
        return cb(null, childs)
      }

      const create = (childs, cb) => {
        dt.children = childs
        let permission = new Permission(dt)
        var error = permission.validateSync()
        if (error) {
          var errorKeys = Object.keys(error.errors)
          return cb(error.errors[errorKeys[0].message].toString())
        }

        permission.save((err, data) => {
          if (err) return cb(err.toString())
          return cb(null, data)
        })
      }

      async.waterfall([checkKeysDefine, checkKeysDefineChildren, create], (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/permission/:id', (req, res) => {
    try {
      let field = req.body
      delete field.id

      Permission.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/permission/:id', (req, res) => {
    try {
      var { id } = req.params
      Permission.deleteOne({_id: ObjectId(id)}, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

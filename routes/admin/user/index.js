var mysql = require('../../../model/mysql')
var models = require('../../../model/mongo/index')
var sha256 = require('sha256')
var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var permissionDefine = require('../../../helper/permission/permission_define')
var { getPermissions } = require('../../../helper/permission/hasPermissions')

var validateUser = (req, res, next) => {
  console.log('req', req.query)
  if (!req.query.username) {
    next(res.status(500).json({message: 'please enter username'}))
  }

  if (!req.query.password) {
    next(res.status(500).json({message: 'please enter password'}))
  }
  next()
}

module.exports = (router) => {
  router.get('/login', validateUser, function (req, res) {
    try {
      var ip = req.connection.remoteAddress
      var user = req.query.username
      var pass = sha256(req.query.password)
      if (user === '') utility.apiResponse(res, 500, 'request invalid')
      var accountModel = new mysql.service.account()
      accountModel.conditionFields({ is_active: 1, is_delete: 0, username: user, password: pass })
      accountModel.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            var data = result
            data.token = authUser.getToken(user, pass)
            data.permissionDefine = permissionDefine
            data.permissions = getPermissions()
            models.User.create(data, ip, (err, user) => {
              if (err) return utility.apiResponse(res, 500, 'can\'t get token')
              delete data['password']
              delete data['id']
              return res.status(200).json({ status: 200, message: 'success', data })
            })
          } else return utility.apiResponse(res, 500, 'User not found')
        }
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/logout', (req, res) => {
    let idtoken = req.query.disconnect

    models.User.findOneAndRemove({ _id: idtoken }, (err, data) => {
      if (err) {
        res.status(500).json({message: 'server error'})
      }
      res.status(200).json({message: 'success'})
    })
  })

  router.get('/get-user', authUser.checkTokenAdmin, function (req, res) {
    var username = req.query.username
    var accountModel = new mysql.service.account()
    accountModel.conditionFields({ is_active: 1, is_delete: 0, username: username })
    accountModel.whereItem((err, result) => {
      if (err) utility.apiResponse(res, 500, 'server error')
      if (result) {
        var data = result
        data.token = req.query.token
        delete data['password']
        delete data['id']
        data.permissions = getPermissions()
        getPemrisionsUser(result.type, (err, response) => {
          if (err) return utility.apiResponse(res, 500, 'Permissions error')
          data.permissionsUser = response && response.permissions ? response.permissions : null
          return utility.apiResponse(res, 200, 'success', data)
        })
      } else {
        return utility.apiResponse(res, 500, 'User not found')
      }
    })
  })
}

let getPemrisionsUser = (code, cb) => {
  try {
    let GroupPermissions = new mysql.service.GroupPermissions()
    GroupPermissions.conditionFields({ code: code })
    GroupPermissions.whereItem((err, result) => {
      if (err) return cb(err)
      if (!result) return cb(null, null)
      return cb(null, result)
    })
  } catch (error) {
    return cb(error)
  }
}

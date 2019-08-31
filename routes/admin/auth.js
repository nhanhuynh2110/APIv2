const _ = require('lodash')
const async = require('async')
var Models = require('../../model/mongo')
var sha256 = require('sha256')
var authUser = require('../../controller/authenticate/autuser')
var utility = require('../../helper/utility')
const { hasPermissions } = require('../../helper/permissions')

var validateUser = (req, res, next) => {
  const {username, password} = req.query
  if (!username || !password) next(res.status(500).json({message: 'please enter username or password'}))
  else next()
}

module.exports = (router) => {
  router.get('/login', validateUser, function (req, res) {
    try {
      var ip = req.connection.remoteAddress
      var {username, password} = req.query
      const user = (cb) => {
        Models.User.findOne({ username, password: sha256(password), isActive: true, isDelete: false }, (err, user) => {
          if (err) return cb(err)
          return cb(null, user)
        })
      }

      const role = (user, cb) => {
        if (!user) return cb(new Error('user invalid'))
        let token = authUser.getToken(username, password)
        addRoleUser(user, token, cb)
      }

      async.waterfall([user, role], (error, user) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        let newToken = new Models.Token({
          username,
          userId: user._id,
          token: user.token,
          ip: ip
        })
        newToken.save((err) => {
          if (err) return utility.apiResponse(res, 500, 'can\'t get token')
          return res.status(200).json({ status: 200, message: 'success', user })
        })
      })
    } catch (error) {
      return utility.apiResponse(res, 500, error.toString())
    }
  })

  router.get('/logout', (req, res) => {
    let idtoken = req.query.disconnect

    Models.Token.findOneAndRemove({ _id: idtoken }, (err, data) => {
      if (err) return utility.apiResponse(res, 500, 'Server error')
      return res.status(200).json({message: 'success'})
    })
  })

  router.get('/auth-user/:username', authUser.checkTokenAdmin, (req, res) => {
    try {
      const { username } = req.params
      Models.User.findOne({ isActive: true, isDelete: false, username: username }, (error, user) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        if (!user) return utility.apiResponse(res, 404, 'user empty')
        addRoleUser(user, req.token, (err, data) => {
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'Success', data)
        })
      })
    } catch (error) {
      return utility.apiResponse(res, 500, error.toString())
    }
  })
}

const addRoleUser = (user, token, callback) => {
  Models.Role.findOne({_id: user.roleId, isActive: true, isDelete: false}, (err, role) => {
    var data = {
      token: token,
      _id: user._id,
      roleId: user.roleId,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      address: user.address,
      gender: user.gender,
      identityCard: user.identityCard,
      updateDate: user.updateDate,
      createDate: user.createDate,
      activeDate: user.activeDate,
      isDelete: user.isDelete,
      isActive: user.isActive
    }
    if (err) return callback(null, data)
    data.permissions = hasPermissions(role.permissions)
    return callback(null, data)
  })
}

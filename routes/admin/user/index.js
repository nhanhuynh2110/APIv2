const _ = require('lodash')
const async = require('async')
var Models = require('../../../model/mongo/index')
var sha256 = require('sha256')
var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
const { hasPermissions } = require('../../../helper/permissions')
// var permissionDefine = require('../../../helper/permission/permission_define')
// var { getPermissions } = require('../../../helper/permission/hasPermissions')

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
        Models.Role.findOne({_id: user.roleId, isActive: true, isDelete: false}, (err, role) => {
          let token = authUser.getToken(username, password)
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
          if (err) return cb(null, data)
          data.permissions = hasPermissions(role.permissions)
          return cb(null, data)
        })
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
}

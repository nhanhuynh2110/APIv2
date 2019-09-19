const _ = require('lodash')
const async = require('async')
var ObjectId = require('mongoose').Types.ObjectId
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

  router.put('/user/:id/profile', authUser.checkTokenAdmin, (req, res) => {
    try {
      const arrKeys = ['avatar', 'firstname', 'lastname', 'gender', 'phone', 'address', 'birthdate']
      
      const field = req.body
      const isValid = Object.keys(field).every(el => arrKeys.includes(el))
      if (req.userId.toString() !== req.params.id.toString()) return utility.apiResponse(res, 500, 'User isValid!!!')

      if (!isValid) return utility.apiResponse(res, 500, 'Server Update Profile isValid!!!')

      if (field.birthdate) field.birthdate = new Date(field.birthdate)
      const tokenFn = (cb) => Models.Token.findOne({ token: req.token, userId: req.params.id }, cb)

      const userFn = (tokenData, cb) => {
        if (!tokenData) return cb(new Error('Token is Valid!!!'))
        Models.User.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, user) => {
          if (err) return cb(err.toString())
          return addRoleUser(user, tokenData.token, cb)
        })
      }

      async.waterfall([tokenFn, userFn], (error, user) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', user)
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.put('/change-password', authUser.checkTokenAdmin, (req, res) => {
    try {
      const arrKeys = ['password', 'confirmPassword']
      const field = req.body
      const isValid = Object.keys(field).every(el => arrKeys.includes(el))

      // if (req.userId !== req.params.id) return utility.apiResponse(res, 500, 'User isValid!!!')

      if (!isValid) return utility.apiResponse(res, 500, 'info invalid isValid!!!')

      const {password, confirmPassword} = field

      if (!password) return utility.apiResponse(res, 500, 'password is not empty !!!')

      if (password !== confirmPassword) return utility.apiResponse(res, 500, 'confirm password is not match !!!')

      Models.User.findOneAndUpdate({ _id: ObjectId(req.userId) }, field, {new: true}, (err, user) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })

    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error')
    }
  })
}

const addRoleUser = (user, token, callback) => {
  Models.Role.findOne({_id: user.roleId, isActive: true, isDelete: false}, (err, role) => {
    var data = {
      token: token,
      _id: user._id,
      avatar: user.avatar,
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
      isActive: user.isActive,
      phone: user.phone
    }
    if (err) return callback(null, data)
    data.permissions = hasPermissions(role.permissions)
    return callback(null, data)
  })
}

var bodyParser = require('body-parser')
var autController = require('../controller/authenticate/aut')
var express = require('express')
process.env.SECRET_KEY = 'tagroupapi'

var async = require('async')
const fs = require('fs')
require('../model/mongo/mongoDB')
const Models = require('../model/mongo')
var sha256 = require('sha256')
module.exports = (app) => {
  const role = (cb) => {
    Models.Role.findOne({ title: 'Master' }, (err, r) => {
      if (err) return cb(err)
      if (r) return cb(null, r)
      const role1 = new Models.Role({
        title: 'Master',
        permissions: ['CATEGORYVIEW', 'POSTVIEW', 'ACCOUNTVIEW', 'GALLERYEDIT'],
        isActive: true
      })

      role1.save((err, myrole) => {
        return cb(err, myrole)
      })
    })
  }

  const user = (role, cb) => {
    Models.User.findOne({ username: 'master' }, (r, myUser) => {
      if (myUser) return cb(null, myUser)
      const userSave = new Models.User({
        username: 'master',
        email: 'phumanong@gmail.com',
        password: sha256('nhanhuynh'),
        firstname: 'phu',
        lastname: 'huynh',
        birthdate: new Date(),
        address: 'duong so 1 go vap hcm',
        phone: '000000000000',
        gender: 1,
        identityCard: null,
        roleId: role._id,
        isActive: true
      })
      userSave.save((err, u) => {
        return cb(err, u)
      })
    })
  }
  async.waterfall([role, user], (err, data) => {
    if (err) global.logger.info('create user erorr')
    else {
      global.logger.info('userdata: ' + data._id)
    }
  })

  app.use('/', express.static('uploads'))
  app.use(bodyParser())
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    return next()
  })

  app.get('/', (req, res) => {
    Models.User.find({}, (err, data) => {
      if (err) return res.send('connect mongo fail')
      else res.send(data)
    })
  })

  app.get('/getToken', autController.getToken)

  app.get('/load_images', function (req, res) {
    fs.readFileSync('images.json')
    res.sendfile('images.json')
  })

  app.use('/api/admin', require('../routes/admin'))

  // api web
  app.use('/web', require('../routes/web'))
}

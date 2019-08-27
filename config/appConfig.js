var bodyParser = require('body-parser')
var autController = require('../controller/authenticate/aut')
var express = require('express')
process.env.SECRET_KEY = 'tagroupapi'
const fs = require('fs')
  // const Models = require('../model/mongo')
  // var sha256 = require('sha256')
module.exports = (app) => {
  require('../model/mongo/mongoDB')

  // const role = new Models.Role({
  //   title: 'Master',
  //   permissions: ['CATEGORYVIEW', 'POSTVIEW', 'ACCOUNTVIEW'],
  //   isActive: true
  // })

  // role.save((err, myrole) => {
  //   const user = new Models.User({
  //     username: 'master',
  //     email: 'phumanong@gmail.com',
  //     password: sha256('nhanhuynh'),
  //     firstname: 'phu',
  //     lastname: 'huynh',
  //     birthdate: new Date(),
  //     address: 'duong so 1 go vap hcm',
  //     phone: '000000000000',
  //     gender: 1,
  //     identityCard: null,
  //     roleId: myrole._id,
  //     isActive: true
  //   })
  //   user.save()
  // })
  app.use('/', express.static('uploads'))
  app.use(bodyParser())
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    return next()
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

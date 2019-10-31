var bodyParser = require('body-parser')
var autController = require('../controller/authenticate/aut')
var express = require('express')
process.env.SECRET_KEY = 'tagroupapi'
const fileRouter = require('../routes/file')
const initUser = require('../model/mongo/initUser')

require('../model/mongo/mongoDB')
const Models = require('../model/mongo')
module.exports = (app) => {
  initUser()

  app.use('/', express.static('uploads'))
  app.use(bodyParser())
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    return next()
  })

  app.get('/', (req, res) => {
    Models.User.find({}, (err, data) => {
      if (err) return res.send('connect mongo fail')
      else res.send('start api success')
    })
  })

  app.get('/getToken', autController.getToken)

  // file api
  fileRouter(app)

  // admin api
  app.use('/api/admin', require('../routes/admin'))

  // api web
  app.use('/web', require('../routes/web'))
}

var bodyParser = require('body-parser')
var autController = require('../controller/authenticate/aut')
var express = require('express')
process.env.SECRET_KEY = 'tagroupapi'
const fs = require('fs')
module.exports = (app) => {
  require('../model/mongo/mongoDB')
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

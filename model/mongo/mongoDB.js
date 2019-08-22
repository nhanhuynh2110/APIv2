var config = require('../../config/config')
var mongoose = require('mongoose')
mongoose.connect(config.mongoDB.connect, {
  useMongoClient: true
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
module.exports = db



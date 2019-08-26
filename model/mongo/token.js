const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  username: {type: String, require: true, uppercase: false},
  userId: {type: String, required: true},
  userCode: {type: String, default: ''},
  token: {type: String, default: ''},
  ip: {type: String, default: ''}
})

module.exports = mongoose.model('token', model)

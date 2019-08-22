const {Schema} = require('mongoose')

module.exports = new Schema({
  username: {type: String, require: true, uppercase: false},
  userId: {type: String, required: true},
  userCode: {type: String, default: ''},
  token: {type: String, default: ''},
  ip: {type: String, default: ''}
})

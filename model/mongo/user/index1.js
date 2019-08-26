const { userSchema } = require('./schemas')
const methods = require('./methods')
var mongoose = require('mongoose')

methods(userSchema)

module.exports = mongoose.model('User', userSchema)

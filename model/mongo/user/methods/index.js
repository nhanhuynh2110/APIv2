const staticMethods = require('./static')
// const instanceMethods = require('./instance')

module.exports = function (schema) {
  schema.statics = staticMethods
  // schema.methods = instanceMethods
}

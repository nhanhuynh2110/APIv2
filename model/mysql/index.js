let library = require('./library')
var service = require('./service')

let store = require('./store')

var mysql = {
  // query: connection,
  lib: library,
  service: service,
  store: store
}

module.exports = mysql

var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

require('./category')(router)
require('./blog')(router)
require('./home')(router)
require('./video')(router)
require('./product')(router)
require('./homecontent')(router)
require('./header')(router)
require('./banner')(router)


module.exports = router

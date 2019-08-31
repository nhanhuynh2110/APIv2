var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

require('./mNav')(router)

module.exports = router

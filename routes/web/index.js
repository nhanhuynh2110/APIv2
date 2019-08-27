var express = require('express')
var router = express.Router()

require('./edu')(router)

module.exports = router

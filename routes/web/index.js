var express = require('express')
var router = express.Router()

require('./acq')(router)

module.exports = router

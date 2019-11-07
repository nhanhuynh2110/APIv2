var express = require('express')
var router = express.Router()

const { withAPI } = require('../middlewares')
router.use(withAPI())

require('./default')(router)

module.exports = router

var express = require('express')
var router = express.Router()

const authUser = require('../../controller/authenticate/autuser')

require('./auth')(router)

router.use('/*', authUser.checkTokenAdmin)

require('./user')(router)
require('./category')(router)
require('./categoryPost')(router)
require('./post')(router)
require('./role')(router)
require('./gallery')(router)

module.exports = router

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
require('./product')(router)
require('./advertise')(router)
require('./slide')(router)
require('./permission')(router)
require('./permissionDefine')(router)
require('./fileManager')(router)

module.exports = router

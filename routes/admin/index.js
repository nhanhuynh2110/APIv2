const router = require('express').Router()

const { withAPI } = require('../middlewares')

const authUser = require('../../controller/authenticate/autuser')
router.use(withAPI())
require('./auth')(router)
router.use('/*', authUser.checkTokenAdmin)

require('./user')(router)
require('./category')(router)
require('./categoryPost')(router)
require('./contact')(router)
require('./contactInfo')(router)
require('./post')(router)
require('./role')(router)
require('./gallery')(router)
require('./product')(router)
require('./productMaster')(router)
require('./advertise')(router)
require('./slide')(router)
require('./permission')(router)
require('./permissionDefine')(router)
require('./fileManager')(router)

module.exports = router

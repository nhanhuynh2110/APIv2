var express = require('express')
var router = express.Router()

// router.use((err, req, res, next) => {
//   res.status(500).json({ message: `Something broken!` })
// })

require('./user')(router)
require('./advertise')(router)
require('./category')(router)
require('./categoryPost')(router)
require('./post')(router)
require('./role')(router)
require('./blog')(router)
require('./home')(router)
require('./common')(router)
require('./account')(router)
require('./video')(router)
require('./partner')(router)
require('./home_content')(router)
require('./group_permission')(router)
require('./banner')(router)
require('./collection')(router)
require('./header')(router)
require('./product')(router)
require('./category_news')(router)
require('./category_product')(router)
require('./news')(router)

module.exports = router

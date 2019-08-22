var express = require('express')
var router = express.Router()

router.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).json({ message: `Something broke!` })
})

require('./user')(router)
require('./advertise')(router)
require('./category')(router)
require('./blog')(router)
require('./home')(router)
require('./common')(router)
require('./account')(router)
// require('./account_common')(router)
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

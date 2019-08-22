var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')

var permission_define = require('../../../helper/permission/permission_define')
var { hasPermission } = require ('../../../helper/permission/hasPermissions')

module.exports = function(router) {
  router.get('/banner/get-banner', function(req, res) {
      try {
        console.log('12121212')
        let type  = 'admin'
        
        console.log('has', hasPermission(permission_define.USER, type), 'has')
        if (!hasPermission(permission_define.USER, type)) {
          res.status(200).json({status: 500, message: 'no permission', data: {}})
        }


        var banner = new mysql.service.banner()
        banner.conditionFields({is_active: 1, is_delete: 0})
        banner.where((err, result) => {
            if (err) res.status(200).json({status: 200, message: 'success', data: {}})
            else res.status(200).json({status: 200, message: 'success', data: result})
        })
      } catch (error) {
        res.status(500).json({status: 500, message: 'server error'})
      }
  })
}
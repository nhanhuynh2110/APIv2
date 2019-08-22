var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')

module.exports = function(router) {
  router.get('/header/get-header', function(req, res) {
      try {
        var header = new mysql.service.header()
        header.conditionFields({is_active: 1, is_delete: 0})
        header.whereItem((err, result) => {
            if (err) res.status(200).json({status: 200, message: 'success', data: {}})
            else res.status(200).json({status: 200, message: 'success', data: result})
        })
      } catch (error) {
        res.status(500).json({status: 500, message: 'server error'})
      }
  })
}
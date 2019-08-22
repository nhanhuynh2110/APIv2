
var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function(router) {
  router.get('/product/get-all-product', function(req, res) {
    var sql = 'select * from viewproduct where is_active = 1'
    mysql.lib.query(sql, true, (error, results, fields) => {
      if (error) return console.error(error.message)
      if (results) {
        res.status(200).json({status: 200, message: 'success', data: results})
      } else {
        res.status(200).json({status: 200, message: 'success', data: []})
      }
    })
  })
}
var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')
module.exports = function (router) {
  router.get('/advertise/grid', authUser.checkTokenAdmin, function (req, res) {
    console.log('advertise grid')
    try {
      var obj = {
        searchKey: req.query.strKey,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        columnsSearch: req.query.columnsSearch,
        colSort: req.query.colSort,
        typeSort: req.query.typeSort,
        isTab: req.query.isTab,
        userCode: req.query.userCode
      }
      lib.grid(res, obj)
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, 'Server error')
    }
  })
}

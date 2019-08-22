var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function (router) {
  router.get('/group-permissions/grid', authUser.checkTokenAdmin, (req, res) => {
    try {
      var obj = {
        searchKey: req.query.strKey,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        columnsSearch: req.query.columnsSearch,
        colSort: req.query.colSort,
        typeSort: req.query.typeSort,
        isDel: req.query.isDel
      }
      lib.grid(res, obj)
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  })

  router.post('/group-permissions/form', authUser.checkTokenAdmin, (req, res) => {
    try {
      let { action, name } = req.body
      let isActive = req.body['is_active']
      let isDelete = req.body['is_delete']
      if (!action || (action !== 'create' && action !== 'edit')) {
        res.status(500).json({ status: 500, message: 'action doesn\'t exists' })
        res.end()
      } else if (!name || name.trim() === '') {
        res.status(500).json({ status: 500, message: 'name is not empty' })
        res.end()
      } else if (!isActive || isActive === null || (parseInt(isActive) !== 1 && parseInt(isActive) !== 0)) {
        res.status(500).json({ status: 500, message: 'active is not empty' })
        res.end()
      } else if (!isDelete || isDelete === null || (parseInt(isDelete) !== 1 && parseInt(isDelete) !== 0)) {
        res.status(500).json({ status: 500, message: 'delete is not empty' })
        res.end()
      } else {
        // console.log('req.body', req.body)
        switch (action) {
          case 'create':
            lib.insertRow(res, req.body)
            break
          case 'edit':
            lib.updateRow(res, req.body)
            break
          default:
            utility.apiResponse(res, 500, 'request invalid')
        }
      }
    } catch (e) {
      res.status(500).json({ message: `server error` })
    }
  })

  router.get('/group-permissions/code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var code = req.query.code
      lib.getByCode(res, code)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  router.get('/group-permissions/get-all', authUser.checkTokenAdmin, (req, res) => {
    try {
      lib.getAll(res, false)
    } catch (error) {
      utility.apiResponse(res, 500, error, null)
    }
  })
}

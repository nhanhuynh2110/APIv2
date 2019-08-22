var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = (router) => {
  router.get('/partner/grid', authUser.checkTokenAdmin, (req, res) => {
    try {
      var obj = {
        searchKey: req.query.strKey,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        columnsSearch: req.query.columnsSearch || 'name, company',
        colSort: req.query.colSort,
        typeSort: req.query.typeSort,
        isDel: req.query.isDel
      }
      return lib.grid(res, obj)
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })

  router.post('/partner/form', authUser.checkTokenAdmin, (req, res) => {
    try {
      if (!req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
        utility.apiResponse(res, 500, 'Action doesn\'t exits', null)
      } else if (!req.body.name || req.body.title === null || req.body.name.trim() === '') {
        utility.apiResponse(res, 500, 'Name not empty', null)
      } else if (!req.body.company || req.body.title === null || req.body.company.trim() === '') {
        utility.apiResponse(res, 500, 'Company not empty', null)
      } else if (!req.body.email || req.body.title === null || req.body.email.trim() === '') {
        utility.apiResponse(res, 500, 'Email not empty', null)
      } else if (!req.body.logo || req.body.title === null || req.body.logo.trim() === '') {
        utility.apiResponse(res, 500, 'Logo not empty', null)
      } else if (!req.body.active || req.body.active === null || (parseInt(req.body.active) !== 1 && parseInt(req.body.active) !== 0)) {
        utility.apiResponse(res, 500, 'Active not empty', null)
      } else if (!req.body.del || req.body.del === null || (parseInt(req.body.del) !== 1 && parseInt(req.body.del) !== 0)) {
        utility.apiResponse(res, 500, 'Delete not empty', null)
      } else {
        var action = req.body.action
        switch (action) {
          case 'create':
            lib.insertRow(res, req.body)
            break
          case 'edit':
            lib.updateRow(res, req.body)
            break
          default:
            return utility.apiResponse(res, 500, 'request invalid')
        }
      }
    } catch (e) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })

  router.get('/partner/update', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { data } = req.query
      if (!data) return utility.apiResponse(res, 500, 'request invalid', null)
      var obj = JSON.parse(data)
      var { condition, field } = obj
      if (!condition || !field) return utility.apiResponse(res, 500, 'request invalid', null)
      lib.update(res, condition, field)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.get('/partner/code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var code = req.query.code
      lib.getByCode(res, code)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.get('/partner/delete', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { code } = req.query
      if (!code) return utility.apiResponse(res, 500, 'Request invalid', null)
      var condition = {
        code: code
      }
      lib.delete(res, condition)
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')
module.exports = function (router) {
  router.get('/account/grid', authUser.checkTokenAdmin, (req, res) => {
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

  router.post('/account/form', authUser.checkTokenAdmin, (req, res) => {
    try {
      if (!req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
        global.logger.error('account : action invalid ' + req.body.action)
        res.status(500).json({ status: 500, message: 'action doesn\'t exits' })
        res.end()
      } else if (!req.body.username || req.body.username === null || req.body.username.trim() === '') {
        global.logger.error('account : username invalid ' + req.body.action)
        res.status(500).json({ status: 500, message: 'username not empty' })
        res.end()
      } else if (!req.body.email || req.body.email === null) {
        global.logger.error('account : email invalid ' + req.body.action)
        res.status(500).json({ status: 500, message: 'email not empty' })
        res.end()
      } else if (!req.body.is_active || req.body.is_active === null || (parseInt(req.body.is_active) !== 1 && parseInt(req.body.is_active) !== 0)) {
        global.logger.error('account : is_active invalid ' + req.body.action)
        res.status(500).json({ status: 500, message: 'active not empty' })
        res.end()
      } else if (!req.body.is_delete || req.body.is_delete === null || (parseInt(req.body.is_delete) !== 1 && parseInt(req.body.is_delete) !== 0)) {
        global.logger.error('account : is_delete invalid ' + req.body.action)
        res.status(500).json({ status: 500, message: 'delete not empty' })
        res.end()
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
            global.logger.error('account : request invalid ')
            utility.apiResponse(res, 500, 'request invalid')
        }
      }
    } catch (e) {
      global.logger.error('account : catch error ' + e.toString())
      res.status(500).json({ message: `server error` })
    }
  })

  /**
   * method: get
   * params: code: String
   */
  router.get('/account/code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var code = req.query.code
      lib.getByCode(res, code)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  router.get('/account/update', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { data } = req.query
      if (!data) utility.apiResponse(res, 500, 'request invalid', null)
      var obj = JSON.parse(data)
      var { condition, field } = obj

      if (!condition || !field) utility.apiResponse(res, 500, 'request invalid', null)
      lib.update(res, condition, field)
    } catch (err) {
      utility.apiResponse(res, 500, err, null)
    }
  })

  router.get('/account/delete', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { code } = req.query
      if (!code) utility.apiResponse(res, 500, 'Request invalid', null)
      var condition = {
        code: code
      }
      lib.delete(res, condition)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  })

  router.get('/account/check-username', authUser.checkTokenAdmin, (req, res) => {
    try {
      lib.checkUserOrEmail(res, req.query, 1)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  router.get('/account/check-email', authUser.checkTokenAdmin, (req, res) => {
    try {
      lib.checkUserOrEmail(res, req.query, 2)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  router.get('/account/checkPassword', authUser.checkTokenAdmin, (req, res) => {
    try {
      lib.checkPassword(res, req.query)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  router.get('/changePassword', (req, res) => {
    try {
      lib.changePassword(res, req.query)
    } catch (error) { utility.apiResponse(res, 500, error, null) }
  })

  // router.get('./permission', authUser.checkTokenAdmin, (req, res) => {
  //     try {
  //         var code = req.query.code
  //         lib.getByCode(res, code)
  //         console.log('per', res, code)
  //     } catch (error) { utility.apiResponse(res, 500, error, null) }
  // })
}

var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function (router) {
  router.post('/blog/form', authUser.checkTokenAdmin, function (req, res) {
    try {
      if (!req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
        res.status(500).json({ status: 500, message: 'action doesn\'t exits' })
      } else if (!req.body.title || req.body.title === null || req.body.title === '') {
        res.status(500).json({ status: 500, message: 'title not empty' })
      } else if (!req.body.intro_title || req.body.intro_title === null || req.body.intro_title === '') {
        res.status(500).json({ status: 500, message: 'intro title not empty' })
      } else if (!req.body.intro_image || req.body.intro_image === null || req.body.intro_image === '') {
        res.status(500).json({ status: 500, message: 'intro image not empty' })
      } else if (!req.body.image || req.body.image === null || req.body.image === '') {
        res.status(500).json({ status: 500, message: 'image not empty' })
      } else if (!req.body.category_id || req.body.category_id === null || req.body.category_id === '') {
        res.status(500).json({ status: 500, message: 'category not empty' })
      } else if (!req.body.is_active || req.body.is_active === null || (parseInt(req.body.is_active) !== 1 && parseInt(req.body.is_active) !== 0)) {
        res.status(500).json({ status: 500, message: 'active not empty' })
      } else if (!req.body.is_delete || req.body.is_delete === null || (parseInt(req.body.is_delete) !== 1 && parseInt(req.body.is_delete) !== 0)) {
        res.status(500).json({ status: 500, message: 'delete not empty' })
      } else if (!req.body.acc_id || req.body.acc_id === null || req.body.acc_id === '') {
        res.status(500).json({ status: 500, message: 'account not empty' })
      } else {
        // data form
        var action = req.body.action
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
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/blog/info', authUser.checkTokenAdmin, function (req, res) {
    lib.infoForm(res)
  })

  router.get('/blog/grid', authUser.checkTokenAdmin, function (req, res) {
    try {
      var obj = {
        searchKey: req.query.strKey,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        columnsSearch: req.query.columnsSearch || 'blog_title',
        colSort: req.query.colSort,
        typeSort: req.query.typeSort,
        isTab: req.query.isTab,
        userCode: req.user.userCode
      }
      lib.grid(res, obj)
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/get-blog-by-code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var code = req.query.code
      if (req.query.code && req.query.code.trim() !== '') {
        lib.getByCode(res, code)
      } else {
        res.status(500).json({ status: 500, message: `server error` })
      }
    } catch (e) {
      res.status(500).json({ status: 500, message: `server error` })
    }
  })

  router.post('/blog/update', authUser.checkTokenAdmin, (req, res) => {
    try {
      var data = req.body
      var { condition, field } = data

      if (!condition || !field) utility.apiResponse(res, 500, 'request invalid', null)
      return lib.update(res, condition, field)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.post('/blog/delete', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { code } = req.query
      if (!code) utility.apiResponse(res, 500, 'Request invalid', null)
      var condition = {
        code: code
      }
      return lib.delete(res, condition)
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}

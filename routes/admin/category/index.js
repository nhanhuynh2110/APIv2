var authUser = require('../../../controller/authenticate/autuser')
var utility = require('../../../helper/utility')
var lib = require('./lib')
module.exports = function (router) {
  router.get('/category/grid', authUser.checkTokenAdmin, (req, res) => {
    try {
      var obj = {
        searchKey: req.query.strKey,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        columnsSearch: req.query.columnsSearch || 'title, create_date, is_active',
        colSort: req.query.colSort,
        typeSort: req.query.typeSort,
        isDel: req.query.isDel
      }
      lib.grid(res, obj)
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  })

  router.post('/category', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {body} = req
      let {title, active} = body
      if (!title || req.body.title.trim() === '') {
        return utility.apiResponse(res, 500, `title not empty`)
      } else if (!active || (parseInt(active) !== 1 && parseInt(active) !== 0)) {
        return utility.apiResponse(res, 500, `active not empty`)
      } else {
        return lib.insertRow(res, req.body)
      }
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.get('/category', authUser.checkTokenAdmin, (req, res) => {
    try {
      return lib.getAll(res, false)
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server Error')
    }
  })

  router.get('/category/:code', authUser.checkTokenAdmin, (req, res) => {
    try {
      return lib.getByCode(res, req.params.code)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.get('/category/get-blogs', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { key, pageSize, pageNumber, category } = req.query
      var data = { key, pageSize, pageNumber, category }
      lib.getBlogs(res, data)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })

  router.put('/category/:code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var field = req.body
      if (!field) return utility.apiResponse(res, 500, 'request invalid', null)
      let condition = {}
      condition['code'] = req.params.code
      delete field.code
      if (!condition) return utility.apiResponse(res, 500, 'request invalid', null)
      return lib.update(res, condition, field)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/category/:code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { code } = req.body
      if (!code) utility.apiResponse(res, 500, 'Request invalid', null)
      var condition = {
        code: code
      }
      lib.delete(res, condition)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}


var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = (router) => {
  router.post('/home-manager/add', authUser.checkTokenAdmin, (req, res) => {
    if (req.body.action && req.body.title && req.body.layout && req.body.is_active) {
      var form = [
        req.body.action,
        req.body.code,
        req.body.title,
        req.body.title,
        req.body.blogs,
        req.body.layout,
        req.body.category_code,
        req.body.is_active
      ]
      let sql = `CALL ${store.home.insert}(?,?,?,?,?,?,?,?)`
      mysql.lib.query(sql, form, (err, results, fields) => {
        if (err) res.status(500).json({ status: 500, message: 'insert fail' })
        if (results) res.status(200).json({ status: 200, message: 'success', data: results[0] })
        else res.status(200).json({ status: 500, message: 'insert fail', data: [] })
      })
    } else res.status(500).json({ status: 500, message: 'insert fail', data: [] })
  })

  router.get('/manager-home', authUser.checkTokenAdmin, (req, res) => {
    try {
      lib.getAll(res)
    } catch (error) {
      utility.apiResponse(res, 200, 'Server Error')
    }
  })

  router.get('/home-manager/manager-home-by-code', (req, res) => {
    try {
      lib.getEditByCode(res, req.query.code)
    } catch (error) {
      utility.apiResponse(res, 200, 'Server Error')
    }
  })

  router.get('/get-blogs-by-manager-homepage-code', authUser.checkTokenAdmin, (req, res) => {
    try {
      var blogs = req.query.blogs
      var arrBlogs = blogs.split(',')
      var blogArr = []
      arrBlogs.forEach((value) => {
        blogArr.push(`'${value}'`)
      })
      var strBlogs = blogArr.join(',')
      lib.getBlogsByHomeManagerCode(res, strBlogs)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })

  router.post('/home_manager/form', authUser.checkTokenAdmin, (req, res) => {
    try {
      if (!req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
        res.status(500).json({ status: 500, message: 'action doesn\'t exits' })
        res.end()
      } else if (!req.body.title || req.body.title === null || req.body.title.trim() === '') {
        res.status(500).json({ status: 500, message: 'title not empty' })
        res.end()
      } else if (!req.body.is_active || req.body.is_active === null || (parseInt(req.body.is_active) !== 1 && parseInt(req.body.is_active) !== 0)) {
        res.status(500).json({ status: 500, message: 'active not empty' })
        res.end()
      } else if (!req.body.is_delete || req.body.is_delete === null || (parseInt(req.body.is_delete) !== 1 && parseInt(req.body.is_delete) !== 0)) {
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
            utility.apiResponse(res, 500, 'request invalid')
        }
      }
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })

  router.get('/home/update-blog', (req, res) => {
    if (!req.query.code || req.query.code === '') {
      res.status(500).json({ status: 500, message: 'code isn\'t empty' })
    } else {
      var code = req.query.code
      var blogs = (req.query.blogs) ? req.query.blogs : ''
      var sql = `UPDATE home_manager SET 
      blogs = '${blogs}'
      WHERE code = '${code}'`
      mysql.lib.query(sql, true, (err, results, fields) => {
        if (err) res.status(500).json({ status: 500, message: 'add blog fail' })
        if (results && results.affectedRows === 1) res.status(200).json({ status: 200, message: 'success' })
      })
    }
  })

  router.post('/home/delete', (req, res) => {
    try {
      var { code } = req.body
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

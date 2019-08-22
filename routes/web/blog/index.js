var config = require('../../../config/config')
var mysql = require('../../../model/mysql')
var utility = require('../../../helper/utility')
var store = mysql.store

module.exports = function (router) {
  router.get('/blog-by-category-limit', function (req, res) {
    var limit = 10
    if (!req.query.cate_id) {
      res.status(500).json({
        message: 'category is not valid'
      })
    }
    if (req.query.limit) {
      limit = req.query.limit
      console.log('limit', limit)
    }
    var cate_id = req.query.cate_id
    let sql = `CALL ${config.store.blog.st_get_blog_by_category_and_limit}(?,?)`
    mysql.lib.query(sql, [cate_id, limit], (err, results) => {
      if (err) {
        res.status(500).json({
          message: 'get blog by category fail'
        })
      }
      res.status(200).json({
        message: 'success',
        data: results
      })
    })
  })

  router.get('/get-blogs-by-category-name', function (req, res) {
    if (req.query.categoryName && req.query.categoryName && req.query.categoryName && req.query.categoryName &&
      req.query.categoryName && req.query.categoryName && req.query.categoryName && req.query.categoryName) {
      var formData = [
        req.query.categoryName,
        req.query.strKey,
        req.query.pageSize,
        req.query.pageNumber,
        req.query.columnsSearch,
        req.query.colSort,
        req.query.typeSort,
        0
      ]
      var formCount = [
        req.query.categoryName,
        req.query.strKey,
        req.query.pageSize,
        req.query.pageNumber,
        req.query.columnsSearch,
        req.query.colSort,
        req.query.typeSort,
        1
      ]
      let sql = `CALL ${store.web.getBlogByCategoryName}(?,?,?,?,?,?,?,?)`

      var count = 0
      mysql.lib.query(sql, formCount, function (err, results, fields) {
        if (err) res.status(500).json({
          status: 500,
          message: `error send data in server`
        })
        if (results) {

          var count = results[0][0].count

          mysql.lib.query(sql, formData, function (error, r, fields) {
            if (error) res.status(500).json({
              status: 500,
              message: `error send data in server`
            })
            if (r) {
              var data = {
                list: r[0],
                total: count
              }
              res.status(200).json({
                status: 200,
                message: 'success',
                data: data
              })
            } else res.status(200).json({
              status: 200,
              message: 'success',
              data: []
            })
          })
          // res.status(200).json({status: 200, message: 'success', data: [] })
        } else res.status(200).json({
          status: 200,
          message: 'success',
          data: []
        })
      })
    } else res.status(500).json({
      status: 500,
      message: 'data not found',
      data: []
    })

  })

  router.get('/get-blog-by-id', (req, res) => {

    try {
      if (!req.query.id || !/^\d+$/.test(req.query.id))
        utility.apiResponse(res, 500, 'Request invalid')
      else {
        var id = (req.query.id) ? req.query.id : null
        var blog = new mysql.service.blog()
        blog.conditionFields({
          is_active: 1,
          is_delete: 0,
          blog_id: id
        })
        blog.whereItem((err, result) => {
          if (err) utility.apiResponse(res, 500, 'Server Error')
          else {
            if (result) utility.apiResponse(res, 200, 'Success', result)
            else utility.apiResponse(res, 200, 'Success', null)
          }
        })
      }
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })

  router.get('/get-all-blog-by-mobile', (req, res) => {
    try {
      var blog = new mysql.service.blog()
      blog.conditionFields({
        is_active: 1,
        is_delete: 0
      })
      blog.orderBy('blog_update_date ASC')
      blog.where((err, result) => {
        if (err) utility.apiResponse(res, 500, 'Server Error')
        else {
          if (result) utility.apiResponse(res, 200, 'Success', result)
          else utility.apiResponse(res, 200, 'Success', null)
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })
}
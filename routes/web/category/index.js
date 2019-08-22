var async = require('async')
var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = (router) => {
  router.get('/category/get-all-category', function(req, res) {
    try {
      var category = new mysql.service.category()
      category.conditionFields({ is_active: 1, is_delete: 0 })
      category.where((err, result)=>{
        if (err) utility.apiResponse(res, 500, 'Server Error')
        else {
          if (result && result.length > 0) utility.apiResponse(res, 200, 'Sucess', result)
          else utility.apiResponse(res, 200, 'Sucess', [])
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })


  router.get('/category/get-blogs-by-link', (req, res) => {
    try {
      var category_link = (req.query.cat_link) ? req.query.cat_link : ''
      var pageSize = (req.query.pageSize) ? req.query.pageSize : 12
      var pageNumber = (req.query.pageNumber) ? req.query.pageNumber : 1
      var category = new mysql.service.category()
      var data = {
        total: 0,
        category: {},
        blogs: []
      }
      
      category.conditionFields({ link: category_link, is_active: 1, is_delete: 0 })
      
      category.whereItem((err, cate) => {
        if (err) return utility.apiResponse(res, 500, 'Server error')
        data.category = cate
        let getListBlogCode = (cb) => {
          var homeManageCode = cate.home_manage_code
          let homeManage = new mysql.service.home_manager()
          homeManage.conditionFields({ is_active: 1, is_delete: 0, code: homeManageCode })
          homeManage.whereItem((err, result) => {
            if (err) return cb(err)
            if (!result) return cb(null, null)
            let blogs = result.blogs
            return cb(null, blogs)
          })
        }

        let getBlogByCategory = (blogs, cb) => {
          var offsetStart = parseInt(pageSize) * (parseInt(pageNumber) - 1)
          var offsetEnd = parseInt(pageSize)
          var blog = new mysql.service.blog()
          blog.select('COUNT(*) as count')
          let arrBlogs = blogs.split(',')
          let arrB = arrBlogs.map((b) => `'${b}'`)
          let strB = arrB.join(',')

          // blog.conditionString(`is_active = 1 AND is_delete = 0 AND blog_category_id = ${cate.code} AND code not in (SELECT code from viewbloginfo where code in (${blogs}))`)
          blog.conditionString(`is_active = 1 AND is_delete = 0 AND blog_category_id = '${cate.code}' AND code not in (SELECT code from viewbloginfo where code in (${strB}))`)
          // blog.conditionFields({ is_active: 1, is_delete: 0, blog_category_id: cate.code })
          blog.orderBy('blog_update_date DESC')
          blog.where((error, result) => {
            if (error) return cb(error)
            else {
              if (!result || result[0]['count'] === 0) return cb(null, data)
              else {
                blog.select('*')
                blog.offset(offsetStart, offsetEnd)
                blog.where((_err, _result) => {
                  if (_err) return cb(null, data)
                  else {
                    if (_result && _result.length > 0) {
                      data.total = result[0]['count']
                      data.blogs = _result
                      return cb(null, data)
                    } else {
                      return cb(null, data)
                    }
                  }
                })
              }
            }
          })
        }
  
        async.waterfall([getListBlogCode, getBlogByCategory], (err, data) => {
          // console.log(err)
          if (err) return utility.apiResponse(res, 500, 'Server error')
          utility.apiResponse(res, 200, 'Success', data)
        })
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/category/home', (req, res) => {
    try {
      lib.isHome(res)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  })
}

function getHomeCategory (res, category = [], blogs = [], total = 0) {
  var sqlHome = `select * from viewhomemanager where code='${category.home_manage_code}' and is_active = 1`

  mysql.lib.query(sqlHome, true, (error, resultHome, fields) => {
    if (error) return console.error(error.message)
    if (resultHome) {
      var data = {
        category: category,
        blogs: blogs,
        total: total,
        homeManager: resultHome[0]
      }
      res.status(200).json({status: 200, message: 'success', data: data})
    } else {
      res.status(200).json({status: 200, message: 'success', data: []})
    }
  })
}
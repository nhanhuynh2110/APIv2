var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')
const async = require('async')

module.exports = function (router) {
  router.get('/get-all-home-manager', function (req, res) {
    try {
      var homeManager = new mysql.service.home_manager()
      homeManager.conditionFields({ is_active: 1, is_delete: 0 })
      homeManager.orderBy(`layout asc`)
      homeManager.where((err, results) => {
        if (err || !results) utility.apiResponse(res, 500, 'Server error')

        async.map(results, (home, cb) => {
          let item = {
            homeManager: home,
            blogs: [],
            category: null
          }
          async.waterfall([getCategory, getBlogs], (err, _data) => {
            if (err) return cb(err)
            return cb(null, _data)
          })
          function getCategory (callback) {
            var category = new mysql.service.category()
            category.conditionFields({ code: home.category_code })
            category.whereItem((err, cat) => {
              if (err) callback(err)
              if (cat) {
                item.category = cat
              }
              callback(null, item)
            })
          }

          function getBlogs (item, callback) {
            var arrblogs = item.homeManager.blogs.split(',')
            var strBlogs = ''
            var arr = arrblogs.map((_v, _k) => `"${_v}"`)
            strBlogs = arr.join(',')
            var blog = new mysql.service.blog()
            blog.conditionString(`code IN (${strBlogs}) AND is_active=1 AND is_delete=0`)
            blog.orderBy(`FIELD (code,${strBlogs})`)
            blog.where((_err, _results) => {
              if (_err) callback('err server')
              else {
                item.blogs = _results
                callback(null, item)
              }
            })
          }
        }, (err, data) => {
          if (err) {
            utility.apiResponse(res, 500, 'Server error')
          }
          utility.apiResponse(res, 200, 'Success', data)
        })
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/home/get-blog-by-category-home', (req, res) => {
    try {
      var arr = []
      var limit = (req.query.limit)? req.query.limit : null
      var category = new mysql.service.category()
      category.conditionFields({ is_active: 1, is_delete: 0, is_home: 1 })
      category.where((err, results)=> {
        if (err) utility.apiResponse(res, 500, 'Server Error')
        else {
          if (results.length > 0) {
            async.map(results, (item, cb) => {
              var cate = item
              var blog = new mysql.service.blog()
              blog.conditionFields({ is_active: 1, is_delete: 0, blog_category_id: cate.code })
              if (limit) blog.limit(limit)
              blog.where((_err, _results) => {
                var data = { category: cate, blogs: [] }
                if (_err) {
                  // arr.push(data)
                  cb (null, data)
                }
                else {
                  if (_results.length > 0) {
                    data.blogs = _results
                    // arr.push(data)
                    cb(null, data)
                  } else {
                    cb(null, data)
                  }
                }
              })
            }, (err, data) => {
              utility.apiResponse(res, 200, 'Success', data)
            })
          }else {
            utility.apiResponse(res, 200, 'Success' ,null)
          }
        }        
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  }),

  router.get('/home/get-new-product', (req, res) => {
    try {
      var limit = (req.query.limit)? req.query.limit : null
      var product = new mysql.service.product()
      product.conditionFields({ is_active: 1, is_delete: 0 })
      if(limit) product.limit(limit)
      product.where((err, result) => {
        if (err) utility.apiResponse(res, 500, 'Server Error')
        else {
          if ( result.length > 0 ) utility.apiResponse(res, 200, 'Success', result)
          else utility.apiResponse(res, 200, 'Success', [])
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  }),

  router.get('/home/check-link', (req, res) => {
    try {
      var link = (req.query.link) ? req.query.link : null
      var obj = {
        category: false,
        category_product: false
      }

      if (!link) utility.apiResponse(res, 500, 'Link not found')
      else {
        checkCategoryLink(link, (status) => {
          obj.category = status
          checkCategoryProductLink(link, (_status) => {
            obj.category_product = _status
            utility.apiResponse(res, 200, 'success', obj)
          })
        })
      }
    } catch (error) {
      utility.apiResponse(res, 500, 'Server Error')
    }
  })
}

var checkCategoryLink = (link, cb) => {
  var category = new mysql.service.category()
  category.conditionFields( { is_active: 1, is_delete: 0 , link: link} ) 
  category.whereItem( (err, result) => {
    if (err) cb(false)
    else {
      if (!result) cb(false)
      else cb(true)
    }
  })
}

var checkCategoryProductLink = (link, cb) => {
  var category_product = new mysql.service.category_product()
  category_product.conditionFields( { is_active: 1, is_delete: 0 , link: link} ) 
  category_product.whereItem( (err, result) => {
    if (err) cb(false)
    else {
      if (!result) cb(false)
      else cb(true)
    }
  })
}

var getBlogsInList = function (item) {

}
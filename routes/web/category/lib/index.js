var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
var async = require('async')

var lib = {
  isHome: (res) => {
    try {
      var condition = {
        is_home: 1,
        is_active: 1,
        is_delete: 0
      }
      var category = new mysql.service.category()
      category.conditionFields(condition)

      category.where((err, listCategory) => {
        if (err) utility.apiResponse(res, 500, 'Server error')
        else {
          if (listCategory.length <= 0) {
            utility.apiResponse(res, 200, 'success', null)
          }
          async.map(listCategory, function (item, cb) {
            var objCategory = item
            var cat_code = objCategory.code
            var _condition = {
              category_code: cat_code,
              blog_is_active: 1,
              blog_is_delete: 0
            }
            var blog = new mysql.service.blog()
            blog.conditionFields(_condition)
            blog.where((_err, listBlog) => {
              var obj = {
                category: objCategory,
                listBlog: listBlog
              }
              cb(null, obj)
            })
          }, (err, data) => {
            arr = data
            utility.apiResponse(res, 200, 'success', data)
          })

        }
      })
    } catch (err) {
      utility.apiResponse(res, 500, 'server error')
    }

  }
}

module.exports = lib
var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
var async = require('async')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                short_title: form.short_title,
                blogs: form.blogs,
                layout: form.layout,
                category_code: form.category_code,
                is_active: form.is_active,
                is_delete: 0
            }
            var homeManager = new mysql.service.home_manager()
            homeManager.setData(params)

            homeManager.save(function (err, result) {
                if (err) {
                  global.logger.error('err save hommanager : request invalid ')
                  utility.apiResponse(res, 500, 'server error')
                }
                else {
                    if (result) utility.apiResponse(res, 200, 'success')
                    else utility.apiResponse(res, 500, 'insert fail')
                }
            })
        } catch (err) {
          global.logger.error('cactch hommanager : request invalid ')
          utility.apiResponse(res, 500, 'server error')
        }

    },

    updateRow: (res, form) => {
        try {
            var params = {
                code: form.code,
                title: form.title,
                short_title: form.short_title,
                blogs: form.blogs,
                layout: form.layout,
                category_code: form.category_code,
                is_active: form.is_active,
                is_delete: form.is_delete
            }

            var homeManager = new mysql.service.home_manager()
            homeManager.conditionString(`code = '${params.code}'`)
            homeManager.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        homeManager.setData(params)
                        homeManager.update((err, result) => {
                            if (result) utility.apiResponse(res, 200, 'success')
                            else utility.apiResponse(res, 500, 'update fail')
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Category not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
        
    },

    grid: (res, obj) => {
        try {
            var category = new mysql.service.category()
            category.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var category = new mysql.service.category()
            category.conditionString(`code = '${code}'`)
            category.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var category = new mysql.service.category()
            category.conditionFields(condition)
            category.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        category.setData(params)
                        category.update((_err, _result) => {
                            if (_err) utility.apiResponse(res, 500, _err)
                            else {
                                if (_result) utility.apiResponse(res, 200, 'success', _result)
                                else utility.apiResponse(res, 500, 'update fail')
                            }
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Category not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

  delete: (res, condition) => {
    try {
      var HomeManager = new mysql.service.home_manager()
      HomeManager.conditionFields(condition)
      HomeManager.delete((err, result) => {
        if (err) return utility.apiResponse(res, 500, 'server error')
        else {
          if (result) return utility.apiResponse(res, 200, 'success', result)
          else return utility.apiResponse(res, 500, 'update fail')
        }
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  },

    getAll: (res) => {
        try {
            var homeManager = new mysql.service.home_manager()
            homeManager.conditionFields({ is_delete: 0 })
            homeManager.orderBy('layout ASC')
            homeManager.where((err, result) => {
                if (err) utility.apiResponse(res, 500, 'Server Error')
                else {
                    if ( result && result.length > 0 ) {
                        var arrData = []
                        async.forEach(result, (item, cb) => {
                            var arrblogs = item.blogs.split(',')
                            var strBlogs = ''
                            var arr = arrblogs.map((_v, _k) => `"${_v}"`)
                            var strBlogs = arr.join(',')
                            var _data = {
                                item: item,
                                count: 0
                            }
                            var blog = new mysql.service.blog()
                            blog.select('count(*) as count')
                            blog.conditionString(`code IN (${strBlogs}) AND is_active=1 AND is_delete=0`)
                            blog.orderBy(`FIELD (code, ${strBlogs})`)
                            blog.whereItem((_err, _result) => {
                                if (_err) {
                                    arrData.push(_data)
                                    cb()
                                }
                                else {
                                    if (_result) {
                                        _data.count = _result['count']
                                        arrData.push(_data)
                                        cb()
                                    } else {
                                        arrData.push(_data)
                                        cb()
                                    }
                                }
                            })
                        }, (err) => {
                            arrData = arrData.sort(function(a, b) {
                                return parseInt(a.item.layout) - parseInt(b.item.layout)
                            })
                            utility.apiResponse(res, 200, 'Success', arrData)
                        })
                        
                    }
                    else utility.apiResponse(res, 200, 'Success', [])
                }
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server Error')
        }
    },
    getEditByCode: (res, code) => {
        try {
            var homeManager = new mysql.service.home_manager()
            homeManager.conditionFields({ is_delete : 0, code : code })
            homeManager.whereItem( (err, result) => {
                if (err) utility.apiResponse(res, 500, 'Server Error')
                else utility.apiResponse(res, 200, 'Success', result)
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server Error')
        }
    },

    getBlogsByHomeManagerCode: (res, strBlogs) => {
        try {
            var blog = new mysql.service.blog()
            blog.conditionString(`code in (${strBlogs}) AND is_active=1 AND is_delete=0`)
            blog.orderBy(`FIELD (code,${strBlogs})`)
            blog.where((err, result) => {
                if (err) utility.apiResponse(res, 500, 'Server Error')
                else utility.apiResponse(res, 200, 'Success', result)
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server Error')
        }
    }
}

module.exports = lib
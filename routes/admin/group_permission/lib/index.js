var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
  insertRow: (res, form) => {
    try {
      var params = {
        code: utility.generateCode(),
        name: form.name,
        permissions: form.permissions,
        is_active: form.is_active,
        is_delete: 0
      }
      let GroupPermission = new mysql.service.GroupPermissions()
      GroupPermission.setData(params)

      GroupPermission.save(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success')
          else utility.apiResponse(res, 500, 'insert fail')
        }
      })
    } catch (err) {
      utility.apiResponse(res, 500, 'server error')
    }
  },

  updateRow: (res, form) => {
    try {
      var params = {
        code: form.code,
        name: form.name,
        permissions: form.permissions,
        is_active: form.is_active,
        is_delete: form.is_delete
      }

      let GroupPermissions = new mysql.service.GroupPermissions()
      GroupPermissions.conditionString(`code = '${params.code}'`)
      GroupPermissions.whereItem((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            GroupPermissions.setData(params)
            GroupPermissions.update((err, result) => {
              if (err) utility.apiResponse(res, 500, 'Server error')
              if (result) utility.apiResponse(res, 200, 'success')
              else utility.apiResponse(res, 500, 'update fail')
            })
          } else {
            utility.apiResponse(res, 500, 'Category not found')
          }
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  grid: (res, obj) => {
    try {
      let GroupPermissions = new mysql.service.GroupPermissions()
      GroupPermissions.filterGridColumns({ is_delete: obj.isDel })
      GroupPermissions.gridCommon(obj, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          utility.apiResponse(res, 200, 'success', result)
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  getByCode: (res, code) => {
    try {
      let GroupPermissions = new mysql.service.GroupPermissions()
      GroupPermissions.conditionFields(`code = '${code}'`)
      GroupPermissions.conditionFields({ code: code, is_delete: 0 })
      GroupPermissions.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
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
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  delete: (res, condition) => {
    try {
      var category = new mysql.service.category()
      category.conditionFields(condition)
      category.delete((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success', result)
          else utility.apiResponse(res, 500, 'update fail')
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  getAll: (res, status = true) => {
    try {
      let GroupPermissions = new mysql.service.GroupPermissions()
      if (!status) {
        GroupPermissions.conditionFields({
          is_active: 1,
          is_delete: 0
        })
      }
      GroupPermissions.where((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success', result)
          else utility.apiResponse(res, 200, [])
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  getBlogs: (res, obj) => {
    try {
      var data = {
        total: 0,
        data: []
      }
      var blog = new mysql.service.blog()
      blog.select('Count(*) as count')
      if (obj.category) {
        blog.conditionString(`CONCAT(blog_title) LIKE "%${obj.key}%" and blog_category_id="${obj.category}" and is_active = 1 and is_delete = 0`)
      } else {
        blog.conditionString(`CONCAT(blog_title) LIKE "%${obj.key}%" and is_active = 1 and is_delete = 0`)
      }
      blog.where((err, result) => {
        if (err) {
          utility.apiResponse(res, 500, 'Server error', null)
        } else {
          data.total = result[0]['count']
          if (result[0]['count'] === 0) utility.apiResponse(res, 200, 'success', data)
          else {
            blog.select('*')
            blog.offset(parseInt(obj.pageSize) * (parseInt(obj.pageNumber) - 1), parseInt(obj.pageSize))
            blog.where((_err, _result) => {
              if (_err) utility.apiResponse(res, 200, 'success', data)
              else {
                if (_result) {
                  data.data = _result
                  utility.apiResponse(res, 200, 'success', data)
                } else utility.apiResponse(res, 200, 'success', data)
              }
            })
          }
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  }
}

module.exports = lib

var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
  insertRow: (res, form) => {
    try {
      var params = {
        code: utility.generateCode(),
        title: form.title,
        is_active: form.active,
        is_delete: 0
      }
      var collection = new mysql.service.collection()
      collection.setData(params)

      collection.save(function (err, result) {
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
        title: form.title,
        is_active: form.active,
        is_delete: form.del
      }

      var collection = new mysql.service.collection()
      collection.conditionString(`code = '${params.code}'`)
      collection.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            collection.setData(params)
            collection.update((err, result) => {
              if (result) utility.apiResponse(res, 200, 'success ')
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
      var collection = new mysql.service.collection()
      collection.filterGridColumns({ is_delete: obj.isDel })
      collection.gridCommon(obj, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          utility.apiResponse(res, 200, 'success', result)
        }
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  getByCode: (res, code) => {
    try {
      var collection = new mysql.service.collection()
      collection.conditionString(`code = '${code}'`)
      collection.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  update: (res, condition, params) => {
    try {
      var collection = new mysql.service.collection()
      collection.conditionFields(condition)
      collection.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            collection.setData(params)
            collection.update((_err, _result) => {
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
      var collection = new mysql.service.collection()
      collection.conditionFields(condition)
      collection.delete((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success', result)
          else utility.apiResponse(res, 500, 'update fail')
        }
      })
    } catch (error) {
      console.log(err)
      utility.apiResponse(res, 500, 'Server error', null) 
    }
  }
}

module.exports = lib

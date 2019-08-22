var mysql = require("../../../../model/mysql");
var utility = require("../../../../helper/utility");

var lib = {

  edit: (res, form) => {
    try {
      var header = new mysql.service.header()
      header.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else {
          if (result) {
            lib.updateRow(res, form)
          } else {
            lib.insertRow(res, form)
          }
        }
      })
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, "server error")
    }
  },

  insertRow: (res, form) => {
    try {
      var params = {
        code: utility.generateCode(),
        title: form.title,
        logo: form.logo,
        image: form.image,
        content: form.content,
        hot_line: form.hot_line,
        is_active: form.active,
        is_delete: 0
      };
      var header = new mysql.service.header()
      header.setData(params)

      header.save((err, result) => {
        if (err) utility.apiResponse(res, 500, "server error")
        else {
          if (result) utility.apiResponse(res, 200, "success")
          else utility.apiResponse(res, 500, "insert fail")
        }
      });
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, "server error")
    }
  },

  updateRow: (res, form) => {
    try {
      var params = {
        code: form.code,
        title: form.title,
        logo: form.logo,
        image: form.image,
        content: form.content,
        hot_line: form.hot_line,
        is_active: form.active,
        is_delete: form.del
      }

      var header = new mysql.service.header()
      header.whereItem(function(err, result) {
        if (err) utility.apiResponse(res, 500, "server error")
        else {
          if (result) {
            var code = result.code
            // console.log('...update with code....', code)
            header.setData(params)
            header.conditionString(`code = '${code}'`)
            header.update((err, result) => {
              if (result) utility.apiResponse(res, 200, "success")
              else utility.apiResponse(res, 500, "update fail")
            })
          } else {
            utility.apiResponse(res, 500, "Category not found")
          }
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, "Server error", null)
    }
  },

  find: (res) => {
    try {
      var header = new mysql.service.header()
      header.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  }
}

module.exports = lib

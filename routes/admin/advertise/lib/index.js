var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {

  grid: (res, obj) => {
    try {
      var advertise = new mysql.service.advertise()
      advertise.filterGridColumns({ is_delete: obj.isDel })
      advertise.gridCommon(obj, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          utility.apiResponse(res, 200, 'success', result)
        }
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  getByCode: (res, code) => {
    try {
      var advertise = new mysql.service.advertise()
      advertise.conditionString(`code = '${code}'`)
      advertise.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  }

  // insertRow: (res, form) => {
  //   try {
  //     var params = {
  //       code: utility.generateCode(),
  //       name: form.title,
  //       img: form.img,
  //       description: form.des,
  //       is_active: form.active,
  //       is_delete: 0
  //     }
  //     var advertise = new mysql.service.advertise()
  //     advertise.setData(params)

  //     advertise.save(function (err, result) {
  //       if (err) utility.apiResponse(res, 500, 'server error')
  //       else {
  //         if (result) utility.apiResponse(res, 200, 'success')
  //         else utility.apiResponse(res, 500, 'insert fail')
  //       }
  //     })
  //   } catch (err) {
  //     utility.apiResponse(res, 500, 'server error')
  //   }
  // },

  // updateRow: (res, form) => {
  //   try {
  //     var params = {
  //       code: form.code,
  //       name: form.title,
  //       image: form.img,
  //       description: form.des,
  //       is_active: form.active,
  //       is_delete: form.del
  //     }

  //     var advertise = new mysql.service.advertise()
  //     advertise.conditionString(`code = '${params.code}'`)
  //     advertise.whereItem(function (err, result) {
  //       if (err) utility.apiResponse(res, 500, 'server error')
  //       else {
  //         if (result) {
  //           advertise.setData(params)
  //           advertise.update((err, result) => {
  //             if (err) utility.apiResponse(res, 500, 'server error')
  //             if (result) utility.apiResponse(res, 200, 'success')
  //             else utility.apiResponse(res, 500, 'update fail')
  //           })
  //         } else {
  //           utility.apiResponse(res, 500, 'Category not found')
  //         }
  //       }
  //     })
  //   } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  // },

  

  // update: (res, condition, params) => {
  //   try {
  //     var advertise = new mysql.service.advertise()
  //     advertise.conditionFields(condition)
  //     advertise.whereItem(function (err, result) {
  //       if (err) utility.apiResponse(res, 500, 'server error')
  //       else {
  //         if (result) {
  //           advertise.setData(params)
  //           advertise.update((_err, _result) => {
  //             if (_err) utility.apiResponse(res, 500, _err)
  //             else {
  //               if (_result) utility.apiResponse(res, 200, 'success', _result)
  //               else utility.apiResponse(res, 500, 'update fail')
  //             }
  //           })
  //         } else {
  //           utility.apiResponse(res, 500, 'Category not found')
  //         }
  //       }
  //     })
  //   } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  // },

  // delete: (res, condition) => {
  //   try {
  //     var advertise = new mysql.service.advertise()
  //     advertise.conditionFields(condition)
  //     advertise.delete((err, result) => {
  //       if (err) utility.apiResponse(res, 500, 'server error')
  //       else {
  //         if (result) utility.apiResponse(res, 200, 'success', result)
  //         else utility.apiResponse(res, 500, 'update fail')
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     utility.apiResponse(res, 500, 'Server error', null)
  //   }
  // }
}

module.exports = lib

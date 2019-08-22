var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                description: form.des,
                content: form.content,
                is_active: form.active,
                is_delete: 0
            }
            var home_content = new mysql.service.home_content()
            home_content.setData(params)
            home_content.save(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) utility.apiResponse(res, 200, 'success')
                    else utility.apiResponse(res, 500, 'insert fail')
                }
            })
        } catch (error) {
            console.log(error)
            utility.apiResponse(res, 500, 'server error')
        }
    },

    updateRow: (res, form) => {
        try {
            var params = {
                code: form.code,
                title: form.title,
                description: form.des,
                content: form.content,
                is_active: form.active,
                is_delete: form.del
            }

            var home_content = new mysql.service.home_content()
            home_content.conditionString(`code = '${params.code}'`)
            home_content.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        home_content.setData(params)
                        home_content.update((err, result) => {
                            if (result) utility.apiResponse(res, 200, 'success')
                            else utility.apiResponse(res, 500, 'update fail')
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Home Content not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
        
    },

    grid: (res, obj) => {
        try {
            
            var homeContent = new mysql.service.home_content()
            homeContent.filterGridColumns({ is_delete: obj.isDel })
            homeContent.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error', null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server error', null)
        }
    },

    getByCode: (res, code) => {
        try {
            var home_content = new mysql.service.home_content()
            home_content.conditionString(`code = '${code}'`)
            home_content.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var home_content = new mysql.service.home_content()
            home_content.conditionFields(condition)
            home_content.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        home_content.setData(params)
                        home_content.update((_err, _result) => {
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
            var home_content = new mysql.service.home_content()
            home_content.conditionFields(condition)
            home_content.delete((err, result) => {
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
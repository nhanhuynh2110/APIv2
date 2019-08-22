var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                image: form.img,
                description: form.des,
                is_active: form.active,
                is_delete: 0
            }
            var banner = new mysql.service.banner()
            banner.setData(params)

            banner.save(function (err, result) {
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
                image: form.img,
                description: form.des,
                is_active: form.active,
                is_delete: form.del
            }

            var banner = new mysql.service.banner()
            banner.conditionString(`code = '${params.code}'`)
            banner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        banner.setData(params)
                        banner.update((err, result) => {
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
            var banner = new mysql.service.banner()
            banner.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var banner = new mysql.service.banner()
            banner.conditionString(`code = '${code}'`)
            banner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var banner = new mysql.service.banner()
            banner.conditionFields(condition)
            banner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        banner.setData(params)
                        banner.update((_err, _result) => {
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
            var banner = new mysql.service.banner()
            banner.conditionFields(condition)
            banner.delete((err, result) => {
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
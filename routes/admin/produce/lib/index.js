var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                description: (form.description) ? form.description : '',
                image: form.image,
                is_active: form.is_active,
                is_delete: 0,
                address: form.address,
                phone: form.phone,
                mobile: form.mobile,
                email: form.email,
                website: form.website
            }
            var news = new mysql.service.news()
            news.setData(params)

            news.save(function (err, result) {
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
                description: (form.description) ? form.description : '',
                image: form.image,
                is_active: form.is_active,
                is_delete: form.is_delete,
                address: form.address,
                phone: form.phone,
                mobile: form.mobile,
                email: form.email,
                website: form.website
            }

            var produce = new mysql.service.produce()
            produce.conditionString(`code = '${params.code}'`)
            produce.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        produce.setData(params)
                        produce.update((err, result) => {
                            if (result) utility.apiResponse(res, 200, 'success')
                            else utility.apiResponse(res, 500, 'update fail')
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Produce not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
        
    },

    grid: (res, obj) => {
        try {
            var produce = new mysql.service.produce()
            produce.filterGridColumns({ is_delete: obj.isDel })
            produce.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var produce = new mysql.service.produce()
            produce.conditionString(`code = '${code}'`)
            produce.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var produce = new mysql.service.produce()
            produce.conditionFields(condition)
            produce.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        produce.setData(params)
                        produce.update((_err, _result) => {
                            if (_err) utility.apiResponse(res, 500, _err)
                            else {
                                if (_result) utility.apiResponse(res, 200, 'success', _result)
                                else utility.apiResponse(res, 500, 'update fail')
                            }
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Produce not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    delete: (res, condition) => {
        try {
            var produce = new mysql.service.produce()
            produce.conditionFields(condition)
            produce.delete((err, result) => {
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
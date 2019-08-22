var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                name: form.name,
                company: form.company,
                email: form.email,
                phone: form.phone,
                logo: form.logo,
                address: form.address,
                is_active: form.active,
                is_delete: 0
            }
            var partner = new mysql.service.partner()
            partner.setData(params)
            partner.save(function (err, result) {
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
                name: form.name,
                company: form.company,
                email: form.email,
                phone: form.phone,
                logo: form.logo,
                address: form.address,
                is_active: form.active,
                is_delete: form.del
            }

            var partner = new mysql.service.partner()
            partner.conditionString(`code = '${params.code}'`)
            partner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        partner.setData(params)
                        partner.update((err, result) => {
                            if (result) utility.apiResponse(res, 200, 'success')
                            else utility.apiResponse(res, 500, 'update fail')
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Partner not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
        
    },

    grid: (res, obj) => {
        try {
            var partner = new mysql.service.partner()
            partner.filterGridColumns({ is_delete: obj.isDel })
            partner.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { 
          console.log(error)
          utility.apiResponse(res, 500, 'Server error', null)
        }
    },

    getByCode: (res, code) => {
        try {
            var partner = new mysql.service.partner()
            partner.conditionString(`code = '${code}'`)
            partner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var partner = new mysql.service.partner()
            partner.conditionFields(condition)
            partner.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        partner.setData(params)
                        partner.update((_err, _result) => {
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
            var partner = new mysql.service.partner()
            partner.conditionFields(condition)
            partner.delete((err, result) => {
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
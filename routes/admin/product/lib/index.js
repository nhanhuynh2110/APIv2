var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                description: form.description,
                image: form.image,
                price_default: form.price_default,
                category_product_id: form.category_product_id,
                is_active: form.is_active,
                is_delete: 0
            }
            var product = new mysql.service.product()
            product.setData(params)

            product.save(function (err, result) {
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
                price_default: form.price_default,
                image: form.image,
                description: form.description,
                category_product_id: form.category_product_id,
                is_active: form.is_active,
                is_delete: form.is_delete
            }

            var product = new mysql.service.product()
            product.conditionString(`code = '${params.code}'`)
            product.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        product.setData(params)
                        product.update((err, result) => {
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
            var product = new mysql.service.product()
            product.filterGridColumns({ is_delete: obj.isDel })
            product.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var product = new mysql.service.product()
            product.conditionString(`code = '${code}'`)
            product.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var product = new mysql.service.product()
            product.conditionFields(condition)
            product.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        product.setData(params)
                        product.update((_err, _result) => {
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
            var product = new mysql.service.product()
            product.conditionFields(condition)
            product.delete((err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) utility.apiResponse(res, 200, 'success', result)
                    else utility.apiResponse(res, 500, 'update fail')
                }
            })
        } catch (error) {
            console.log(error)
            utility.apiResponse(res, 500, 'Server error', null) 
        }
    },
    info: (res) => {
        try {
            var cate_product = new mysql.service.category_product()
            cate_product.conditionFields({ is_active: 1, is_delete: 0 })
            cate_product.where((err, result) => {
                if (err) utility.apiResponse(res, 500, 'Category Not Found')
                else {
                    if (result) {
                        var data = {
                            category_product : result
                        }
                        utility.apiResponse(res, 200, 'Success', data)
                    }
                    else utility.apiResponse(res, 200, 'Succes', [])
                }
            })
        } catch (error) {
            console.log(error)
            utility.apiResponse(res, 500, 'Server Error')
        }
    } 
}

module.exports = lib
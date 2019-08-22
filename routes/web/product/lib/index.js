var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
var async = require('async')

var lib = {
    isHome: (res) => {
        try {
            var condition = {
                is_active: 1,
                is_delete: 0
            }
            var product = new mysql.service.product()
            product.conditionFields(condition)

            product.where((err, listProduct) => {
                if (err) utility.apiResponse(res, 500, 'Server error')
                else {
                    if (listProduct.length <= 0) {
                        utility.apiResponse(res, 200, 'success', null)
                    }
                    async.map(listProduct, function(item, cb){
                        var objProduct = item
                        var code = objProduct.code
                        var _condition = {
                            code: code
                        }
                    }, (err, data) => {
                        arr = data
                        utility.apiResponse(res, 200, 'success', data)
                    })

                }
            })
        } catch (err) {
            utility.apiResponse(res, 500, 'server error')
        }

    }
}

module.exports = lib
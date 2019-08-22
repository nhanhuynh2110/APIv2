var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
var async = require('async')

var lib = {
    getAllHomeContent: (res) => {
        try {
            var condition = {
                is_active: 1,
                is_delete: 0
            }
            var homeContent = new mysql.service.home_content()
            homeContent.conditionFields(condition)
            homeContent.where((err, result) => {
                if (err) utility.apiResponse(res, 500, 'Server error')
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server')
        }
    },

    getHomeContentByCode: (res, code) => {
        try {
            var condition = {
                code: code,
                is_active: 1,
                is_delete: 0
            }

            var homeContent = new mysql.service.home_content()
            homeContent.conditionFields(condition)
            homeContent.whereItem((err, result) => {
                if (err) utility.apiResponse(res, 500, 'Server error')
                if (result) {
                    utility.apiResponse(res, 200, 'success', result)
                } else {
                    utility.apiResponse(res, 500, 'request invalid')
                }
                
            })
        } catch (error) {
            utility.apiResponse(res, 500, 'Server error')
        }
    }
}

module.exports = lib
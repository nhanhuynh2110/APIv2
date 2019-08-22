var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                ifame: form.ifame,
                link: form.link,
                content: form.content,
                is_active: form.active,
                is_delete: 0,
            }
            var video = new mysql.service.video()
            video.setData(params)

            video.save(function (err, result) {
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
                ifame: form.ifame,
                link: form.link,
                content: form.content,
                is_active: form.active,
                is_delete: form.del,
            }

            var video = new mysql.service.video()
            video.conditionString(`code = '${params.code}'`)
            video.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        video.setData(params)
                        video.update((err, result) => {
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
            var video = new mysql.service.video()
            video.filterGridColumns({ is_delete: obj.isDel })
            video.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var video = new mysql.service.video()
            video.conditionString(`code = '${code}'`)
            video.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var video = new mysql.service.video()
            video.conditionFields(condition)
            video.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        video.setData(params)
                        video.update((_err, _result) => {
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
            var video = new mysql.service.video()
            video.conditionFields(condition)
            video.delete((err, result) => {
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
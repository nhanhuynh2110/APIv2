var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                logo: form.logo,
                link: form.link,
                is_active: form.active,
                is_delete: 0,
                is_home: form.is_home,
                sort: form.sort
            }
            var category_news = new mysql.service.category_news()
            category_news.setData(params)

            category_news.save(function (err, result) {
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
                logo: form.logo,
                is_active: form.active,
                is_delete: form.del,
                link: form.link,
                is_home: form.is_home,
                sort: form.sort
            }

            var category_news = new mysql.service.category_news()
            category_news.conditionString(`code = '${params.code}'`)
            category_news.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        category_news.setData(params)
                        category_news.update((err, result) => {
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
            var category_news = new mysql.service.category_news()
            category_news.filterGridColumns({ is_delete: obj.isDel })
            category_news.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var category_news = new mysql.service.category_news()
            category_news.conditionString(`code = '${code}'`)
            category_news.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var category_news = new mysql.service.category_news()
            category_news.conditionFields(condition)
            category_news.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        category_news.setData(params)
                        category_news.update((_err, _result) => {
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
            var category_news = new mysql.service.category_news()
            category_news.conditionFields(condition)
            category_news.delete((err, result) => {
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
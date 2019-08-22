var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')

var lib = {
    insertRow: (res, form) => {
        try {
            var params = {
                code: utility.generateCode(),
                title: form.title,
                intro_title: form.introTitle,
                intro_description: (form.introDes) ? form.introDes : '',
                description: (form.des) ? form.des : '',
                content: form.content.replace(/\'/g, '\\'),
                image: form.img,
                intro_image: form.introImg,
                img_title: (form.imgTitle) ? form.imgTitle : '',
                category_news_id: form.cate,
                is_active: form.active,
                is_delete: 0,
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
                intro_title: form.introTitle,
                intro_description: (form.introDes) ? form.introDes : '',
                description: (form.des) ? form.des : '',
                content: form.content.replace(/\'/g, '\\'),
                image: form.img,
                intro_image: form.introImg,
                img_title: (form.imgTitle) ? form.imgTitle : '',
                category_news_id: form.cate,
                is_active: form.active,
                is_delete: form.delete,
            }

            var news = new mysql.service.news()
            news.conditionString(`code = '${params.code}'`)
            news.whereItemTableBase(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        news.setData(params)
                        news.update((err, result) => {
                            if (result) utility.apiResponse(res, 200, 'success')
                            else utility.apiResponse(res, 500, 'update fail')
                        })
                    } else {
                        utility.apiResponse(res, 500, 'Category News not found')
                    }
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
        
    },

    grid: (res, obj) => {
        try {
            var news = new mysql.service.news()
            news.filterGridColumns({ is_delete: obj.isDel })
            news.gridCommon(obj, (err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    utility.apiResponse(res, 200, 'success', result)
                }
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    getByCode: (res, code) => {
        try {
            var news = new mysql.service.news()
            news.conditionString(`code = '${code}'`)
            news.whereItem(function (err, result) {
                if (err) utility.apiResponse(res, 500, err, null)
                else utility.apiResponse(res, 200, 'success', result)
            })
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    },

    update: (res, condition, params) => {
        try {
            var news = new mysql.service.news()
            news.conditionFields(condition)
            news.whereItemTableBase(function (err, result) {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    if (result) {
                        news.setData(params)
                        news.update((_err, _result) => {
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
            var news = new mysql.service.news()
            news.conditionFields(condition)
            news.delete((err, result) => {
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
    },

    infoForm: () => {
        try {
            var category = new mysql.service.category_news()
            category.conditionFields({ is_active: 1, is_delete: 0})
            category.where((err, result) => {
                if (err) utility.apiResponse(res, 500, 'server error')
                else {
                    var data = {
                        categories : result,
                    }
                    if (result) utility.apiResponse(res, 200, 'success', data)
                    else utility.apiResponse(res, 500, 'update fail')
                }
            })
        } catch (error) {
            console.log(err)
            utility.apiResponse(res, 500, 'Server error') 
        }
    }
}

module.exports = lib
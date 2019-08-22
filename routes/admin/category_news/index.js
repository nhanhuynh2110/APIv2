var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var utility = require('../../../helper/utility')
var store = mysql.store
var service = mysql.service
var lib = require('./lib')
module.exports = function(router) {
    router.get('/category_news/grid', authUser.checkTokenAdmin, (req, res) => {
        try {
            var obj = {
                searchKey: req.query.strKey,
                pageSize: req.query.pageSize,
                pageNumber: req.query.pageNumber,
                columnsSearch: req.query.columnsSearch,
                colSort: req.query.colSort,
                typeSort: req.query.typeSort,
                isDel: req.query.isDel
            }
            lib.grid(res, obj)
        } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
    })

    router.post('/category_news/form', authUser.checkTokenAdmin ,(req, res) => {
        try {
            if( !req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
                res.status(500).json({status: 500, message: 'action doesn\'t exits' })
                res.end()
            } else if( !req.body.title || req.body.title === null || req.body.title.trim() === '' ) {
                res.status(500).json({status: 500, message: 'title not empty' })
                res.end()
            } else if( !req.body.active || req.body.active === null || (parseInt(req.body.active) !== 1 && parseInt(req.body.active) !== 0)) {
                res.status(500).json({status: 500, message: 'active not empty' })
                res.end()
            } else if( !req.body.del || req.body.del === null || (parseInt(req.body.del) !== 1 && parseInt(req.body.del) !== 0 )) {
                res.status(500).json({status: 500, message: 'delete not empty' })
                res.end()
            } else {
                var action = req.body.action
                switch (action) {
                    case 'create':
                        lib.insertRow(res, req.body)
                        break;
                    case 'edit':
                        lib.updateRow(res, req.body)
                        break;
                    default:
                        utility.apiResponse(res, 500, 'request invalid')
                }
            }
            
        } catch (e) {
            res.status(500).json({message: `server error` })
        }
    })

    /**
     * method: get
     * params: code: String
     */
    router.get('/category_news/code', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            lib.getByCode(res, code)
        } catch (error) { utility.apiResponse(res, 500, error, null) }
    })

    router.get('/category_news', authUser.checkTokenAdmin, (req, res) => {
        var sql = `CALL ${store.category_news.getAll}()`
        mysql.lib.query(sql, [true] , function(err, results, fields) {
            if (err) res.status(500).json({status: 500, message: `server error` })
            if (results) {
                res.status(200).json({status: 200, message: 'success', data: results[0] })
            }
            else res.status(500).json({status: 500, message: 'category_news not found', data: [] })
        })
    })

    router.get('/get-news-by-category_news', authUser.checkTokenAdmin, (req, res) => {
        var {key, pageSize, pageNumber, category_news} = req.query
        var offset = utility.offset(pageSize, pageNumber)
        var whereCategoryNews = ''
        if (category_news) {
            whereCategoryNews = `and news_category_news_id='${category_news}'`
        }
        var sql = `SELECT * FROM viewnewsinfo WHERE CONCAT(news_title) LIKE "%${key}%" ${whereCategoryNews}  ${offset}`
        var sqlCount = `SELECT Count(*) as count FROM viewnewsinfo WHERE CONCAT(news_title) LIKE "%${key}%" ${whereCategoryNews}`
        
        mysql.lib.query(sqlCount, true , function(error, response, fields) {
            if (error) res.status(500).json({status: 500, message: `error send data in server` })
            if (response) {
                var count = response[0].count
                mysql.lib.query(sql, true , function(error, result, fields) {
                    if (error) res.status(500).json({status: 500, message: `error send data in server` })
                    if (result) {
                        var data = {
                            total: count,
                            data: result
                        }
                        res.status(200).json({status: 200, message: 'success', data: data })
                    }
                    else res.status(200).json({status: 200, message: 'success', data: [] })
                })
            }
            else res.status(200).json({status: 200, message: 'success', data: [] })
        })

        
    })

    router.get('/category_news/update', authUser.checkTokenAdmin, (req, res) => {
        try {
            var { data } = req.query
            if (!data) utility.apiResponse(res, 500, 'request invalid', null)
            var obj = JSON.parse(data)
            var { condition, field } = obj

            if (!condition || !field) utility.apiResponse(res, 500, 'request invalid', null)
            lib.update(res, condition, field)
        } catch (err) {
            utility.apiResponse(res, 500, err, null)
        }
    })

    router.get('/category_news/delete', authUser.checkTokenAdmin, (req, res) => {
        try {
            var { code } = req.query
            if (!code) utility.apiResponse(res, 500, 'Request invalid', null)
            var condition = {
                code: code
            }
            lib.delete(res, condition)
        } catch (error) {
            utility.apiResponse(res, 500, 'Server error', null)
        }
    })
}
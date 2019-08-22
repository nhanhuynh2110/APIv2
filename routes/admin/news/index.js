var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var validate = require('./validate')
var formatFrom = require('../../../helper/formatForm')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function(router) {
    router.post('/news/form', function(req, res) {
        try {
            if( !req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
                res.status(500).json({status: 500, message: 'action doesn\'t exits' })
            } else if( !req.body.title || req.body.title === null || req.body.title === '' ) {
                res.status(500).json({status: 500, message: 'title not empty' })
            } else if( !req.body.introTitle || req.body.introTitle === null || req.body.introTitle === '' ) {
                res.status(500).json({status: 500, message: 'intro title not empty' })
            } else if( !req.body.introImg || req.body.introImg === null || req.body.introImg === '' ) {
                res.status(500).json({status: 500, message: 'intro image not empty' })
            } else if( !req.body.img || req.body.img === null || req.body.img === '' ) {
                res.status(500).json({status: 500, message: 'image not empty' })
            } else if( !req.body.cate || req.body.cate === null || req.body.cate === '' ) {
                res.status(500).json({status: 500, message: 'category not empty' })
            } else if( !req.body.active || req.body.active === null || (parseInt(req.body.active) !== 1 && parseInt(req.body.active) !== 0 )) {
                res.status(500).json({status: 500, message: 'active not empty' })
            } else if( !req.body.delete || req.body.delete === null || (parseInt(req.body.delete) !== 1 && parseInt(req.body.delete) !== 0 )) {
                res.status(500).json({status: 500, message: 'delete not empty' })
            } else {
                // data form
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
        } catch (error) {
            console.log(error)
            utility.apiResponse(res, 500, 'Server error')
        }
        
    })

    router.get('/news/info', function(req, res) {

        var stGetAllCate = store.category_news.getAll
        let sqlCate = `CALL ${stGetAllCate}()`
        mysql.lib.query(sqlCate, [true], (err, results, fields) => {
            if (err) res.status(500).json({status: 500, message: 'Error Server' })
            var cats = results[0]
            if (results) {
                var data = {
                    categories : cats,
                }
                res.status(200).json({status: 200, message: 'success', data: data })
            } 
            else res.status(200).json({status: 200, message: 'success', data: [] })
        })
    })

    router.get('/news/grid',function(req, res){
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
        } catch (error) {
            console.log(error)
            utility.apiResponse(res, 500, 'Server error')
        }
    })
    
    router.get('/get-news-by-code', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            if (req.query.code && req.query.code.trim() !== '') {
                lib.getByCode(res, code)
            } else {
                res.status(500).json({status: 500, message: `server error` })
            }
        } catch (e) {
            res.status(500).json({status: 500, message: `server error` })
        }
    })

    router.get('/news/update', authUser.checkTokenAdmin, (req, res) => {
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

    router.get('/news/delete', authUser.checkTokenAdmin, (req, res) => {
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
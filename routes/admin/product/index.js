var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var utility = require('../../../helper/utility')
var store = mysql.store
var service = mysql.service
var lib = require('./lib')
module.exports = function(router) {
    router.get('/product/grid', authUser.checkTokenAdmin, (req, res) => {
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

    router.post('/product/form', authUser.checkTokenAdmin ,(req, res) => {
        try {
            if( !req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
                res.status(500).json({status: 500, message: 'action doesn\'t exits' })
                res.end()
            } else if( !req.body.title || req.body.title === null || req.body.title.trim() === '' ) {
                res.status(500).json({status: 500, message: 'title not empty' })
                res.end()
            } else if( !req.body.is_active || req.body.is_active === null || (parseInt(req.body.is_active) !== 1 && parseInt(req.body.is_active) !== 0)) {
                res.status(500).json({status: 500, message: 'active not empty' })
                res.end()
            } else if( !req.body.is_delete || req.body.is_delete === null || (parseInt(req.body.is_delete) !== 1 && parseInt(req.body.is_delete) !== 0 )) {
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
    router.get('/product/code', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            lib.getByCode(res, code)
        } catch (error) { utility.apiResponse(res, 500, error, null) }
    })

    router.get('/get-product-by-category', authUser.checkTokenAdmin, (req, res) => {
        var {key, pageSize, pageNumber, category} = req.query
        var offset = utility.offset(pageSize, pageNumber)
        var whereCategory = ''
        if (category) {
            whereCategory = `and product_category_id='${category}'`
        }
        var sql = `SELECT * FROM viewproductinfo WHERE CONCAT(product_title) LIKE "%${key}%" ${whereCategory}  ${offset}`
        var sqlCount = `SELECT Count(*) as count FROM viewproductinfo WHERE CONCAT(product_title) LIKE "%${key}%" ${whereCategory}`
        
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

    router.get('/product/info', function(req, res) {
        try {
            lib.info(res)
        } catch (error) {
            utility.apiResponse(res, 500, 'Server Error')
        }
        // var stGetAllCateProduct = store.category.getAll
        // let sqlCate = `CALL ${stGetAllCate}()`
        // mysql.lib.query(sqlCate, [true], (err, results, fields) => {
        //     if (err) res.status(500).json({status: 500, message: 'Error Server' })
        //     var cats = results[0]
        //     if (results) {
        //         mysql.lib.query(sqlPartner, [true], (err, r, fields) => {
        //             if (err) res.status(500).json({status: 500, message: 'Error Server' })
        //             if (r)  {
        //                 var data = {
        //                     categories : cats,
        //                     partner : r[0]
        //                 }
        //                 res.status(200).json({status: 200, message: 'success', data: data })
        //             } else {
        //                 var data = {
        //                     categories : cats,
        //                     partner : []
        //                 }
        //                 res.status(200).json({status: 200, message: 'success', data: data })
        //             }
        //         })
        //     } 
        //     else res.status(200).json({status: 200, message: 'success', data: [] })
        // })
    })

    router.get('/product/update', authUser.checkTokenAdmin, (req, res) => {
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

    router.get('/product/delete', authUser.checkTokenAdmin, (req, res) => {
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
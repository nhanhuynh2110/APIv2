var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function(router) {
    router.get('/video/grid', authUser.checkTokenAdmin, (req, res) => {
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

    router.post('/video/form', authUser.checkTokenAdmin ,(req, res) => {
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

    router.get('/video/code', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            lib.getByCode(res, code)
        } catch (error) { utility.apiResponse(res, 500, error, null) }
    })

    router.get('/video/update', authUser.checkTokenAdmin, (req, res) => {
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

    router.get('/video/delete', authUser.checkTokenAdmin, (req, res) => {
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
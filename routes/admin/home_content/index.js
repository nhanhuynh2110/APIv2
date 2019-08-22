var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = (router) => {
    router.get('/home_content/grid', (req, res) => {
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
            utility.apiResponse(res, 500, 'server error', null)
        }
    })

    router.post('/home_content/form', authUser.checkTokenAdmin ,(req, res) => {
        try {
            if( !req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
                utility.apiResponse(res, 500, 'Action doesn\'t exits', null)
            } else if( !req.body.title || req.body.title === null || req.body.title.trim() === '' ) {
                utility.apiResponse(res, 500, 'Title not empty', null)
            } else if( !req.body.active || req.body.active === null || (parseInt(req.body.active) !== 1 && parseInt(req.body.active) !== 0)) {
                utility.apiResponse(res, 500, 'Active not empty', null)
            } else if( !req.body.del || req.body.del === null || (parseInt(req.body.del) !== 1 && parseInt(req.body.del) !== 0 )) {
                utility.apiResponse(res, 500, 'Delete not empty', null)
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

    router.get('/home_content/update', authUser.checkTokenAdmin, (req, res) => {
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

    router.get('/home_content/code', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            lib.getByCode(res, code)
        } catch (error) { 
            console.log(error)
            utility.apiResponse(res, 500, error, null) 
        }
    })

    router.get('/home_content/delete', authUser.checkTokenAdmin, (req, res) => {
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
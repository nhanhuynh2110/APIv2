var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function(router) {
    router.post('/header/form', authUser.checkTokenAdmin ,(req, res) => {
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
                lib.edit(res, req.body)
            }
        } catch (e) {
            res.status(500).json({message: `server error` })
        }
    })

    router.get('/header/find', authUser.checkTokenAdmin, (req, res) => {
        try {
            var code = req.query.code
            lib.find(res)
        } catch (error) { utility.apiResponse(res, 500, error, null) }
    })
}
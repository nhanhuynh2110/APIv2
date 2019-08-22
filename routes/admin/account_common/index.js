var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var utility = require('../../../helper/utility')
var sha256 = require('sha256')

module.exports = function (router) {
    router.get('/account/grid', authUser.checkTokenAdmin, (req, res) => {
        var formData = [
            req.query.strKey,
            req.query.pageSize,
            req.query.pageNumber,
            req.query.columnsSearch,
            req.query.colSort,
            req.query.typeSort,
            1,
            0
        ]

        var formCount = [
            req.query.strKey,
            req.query.pageSize,
            req.query.pageNumber,
            req.query.columnsSearch,
            req.query.colSort,
            req.query.typeSort,
            1,
            1
        ]
        let sql = `CALL ${store.user.gridView}(?,?,?,?,?,?,?,?)`

        var count = 0
        mysql.lib.query(sql, formCount, function (err, results, fields) {
            if (err) res.status(500).json({ status: 500, message: `error send data in server` })
            if (results) {

                var count = results[0][0].count

                mysql.lib.query(sql, formData, function (error, r, fields) {
                    if (error) res.status(500).json({ status: 500, message: `error send data in server` })
                    if (r) {
                        var data = {
                            list: r[0],
                            total: count
                        }
                        res.status(200).json({ status: 200, message: 'success', data: data })
                    }
                    else res.status(200).json({ status: 200, message: 'success', data: [] })
                })
            }
            else res.status(200).json({ status: 200, message: 'success', data: [] })
        })
    })
    router.post('/add-account', authUser.checkTokenAdmin, (req, res) => {
        try {
            if (!req.body.action || req.body.action === null || (req.body.action !== 'create' && req.body.action !== 'edit')) {
                res.status(500).json({ status: 500, message: 'action doesn\'t exits' })
                res.end()
            } else if (!req.body.username || req.body.username === null || req.body.username.trim() === '') {
                res.status(500).json({ status: 500, message: 'username not empty' })
                res.end()
            } else if (!req.body.password || req.body.password === null || req.body.password.trim() === '') {
                res.status(500).json({ status: 500, message: 'password not empty' })
                res.end()
            } else if (!req.body.active || req.body.active === null || (parseInt(req.body.active) !== 1 && parseInt(req.body.active) !== 0)) {
                res.status(500).json({ status: 500, message: 'active not empty' })
                res.end()
            } else if (!req.body.delete || req.body.delete === null || (parseInt(req.body.delete) !== 1 && parseInt(req.body.delete) !== 0)) {
                res.status(500).json({ status: 500, message: 'delete not empty' })
                res.end()
            } else {
                var action = req.body.action
                var code = req.body.code
                var username = req.body.username
                var password = sha256(req.body.password)
                var email = req.body.email
                var firstname = req.body.firstname
                var lastname = req.body.lastname
                var fullname = req.body.fullname
                var address_id = 0
                var phone = req.body.phone
                var birthday = req.body.birthday
                var gender = req.body.gender
                var active = req.body.active
                var isAcc = req.body.isAcc
                var del = req.body.delete
                var now = Date.now()
                                
                var sql = ''
                if (action === 'create') {
                    code = utility.generateCode()
                    var column = ['username','email','password','code']
                    var value = [username, email, password, code]
                    utility.action({column: column, data: value, table: 'user'}, 'create', function(err, results) {
                        if(err) {
                            res.status(500).json({ status: 500, message: 'add user fail' })
                        } else {
                            if(results && results.affectedRows === 1) {
                                var user_id = results.insertId
                                var accCode = utility.generateCode()
                                var cmColumn = ['code', 'firstname', 'lastname', 'fullname', 'address_id', 'email', 'phone',
                                'birthday', 'account_id', 'isUserOrCus', 'gender', 'is_active', 'is_delete', 'create_date', 'update_date',
                                'active_date']
                                var cmV = [accCode ,firstname, lastname, fullname, '',
                                email, phone, birthday, user_id, 1, gender, active,
                                del, now, now, now]
                                utility.action({column: cmColumn, data: cmV, table: 'account_common'}, 'create', function(cmErr, cmResults) {
                                    if (cmErr) {
                                        res.status(500).json({ status: 500, message: 'add user fail'})
                                    } else {
                                        if (cmResults && cmResults.affectedRows === 1) {
                                            res.status(200).json({ status: 200, message: 'success', data: cmResults})
                                        } else {
                                            res.status(500).json({ status: 500, message: 'add user fail'})
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    sql = `UPDATE user SET 
                    username = '${username}',
                    email = '${email}',
                    password = '${password}'
                    WHERE code = '${code}'`
                }
            }

        } catch (e) {
            res.status(500).json({ message: `server error` })
        }
    })
}
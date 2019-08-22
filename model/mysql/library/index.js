var sha256 = require('sha256')
var secretKey = 'TAWL'

let utility = require('./utility')
// var mysql = require('../model/mysql')

let connect = require('../connection')

var library = {
    checkTable: (table, cb) => {
        return utility.isTable(table, cb)
    },
    getLastInsert: (cb) => {
        connect('SELECT LAST_INSERT_ID()', true, (err, results, fields) => { cb(results) })
    },
    action: ({ column, data, table, condition, deleteMutil = false }, type, cb) => {
        if (type === 'delete') {
            if (!condition) return cb('delete function miss condition')
            let strCondition = utility.parseConditionDeletes(condition)
            if (strCondition) {
                utility.sqlDelete(strCondition, table, cb) 
            } 
            else return cb('delete function miss condition')
        } else {
            if (!column && column.length < 1 && !data && data.length < 1 && !table) {
                return cb('column or data or table insert miss value')
            } else {

                if (column.length === data.length) {
                    if (type === 'create') {
                        if (condition) return cb('create function not condition')
                        var strColumn = column.join(',')
                        var strData = utility.parseDataInsert(data)
                        utility.sqlInsert(strColumn, strData, table, cb)
                    } else if (type === 'update') {
                        if (!condition) return cb('update function miss condition')
                        let strData = utility.pasreColumnDataUpdate(column, data)
                        let strCondition = utility.parseCondition(condition)
                        utility.sqlUpdate(strData, strCondition, table, cb)
                    }

                } else {
                    return cb('column and data not match value')
                }
            }
        }
    },
    querySql: (sql, cb) => {
        utility.excuteQuery(sql, cb)
    },
    query: connect,
    excuteStore: (sql, params, cb) => utility.excuteQueryStore(sql, params, cb),
    insert: (table, params, cb) => {
        var sql = `INSERT INTO ${table} SET ?`
        utility.excute(sql, params, (err, result) => {
            if (err) cb(err)
            else {
                if (result && result.insertId > 0) cb(null, true)
                else cb('fail')
            }
        })
    },
    update: (table, params, condition, cb) => {
        var sql = utility.parseDataUpdateToSql(table, params, condition)
        utility.excute(sql, [true] , (err, result) => {
            if (err) cb(err)
            else {
                if (result && result.affectedRows > 0) cb(null, true)
                else cb('fail')
            }
        })

    }
}

module.exports = library
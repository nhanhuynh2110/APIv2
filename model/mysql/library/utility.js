var sha256 = require('sha256')
var secretKey = 'TAWL'
let connect = require('../connection')


var utility = {
    isTable: (table, cb) => {
        new Promise((resolve, reject) => {
            var sql = `CHECK TABLE ${table} FAST QUICK`
            excuteQuery(sql, (err, result) => {
                if (err) resolve(false)
                else {
                    if (result[0] && result[0].Msg_text === 'OK') {
                        resolve(true)
                    }
                    else resolve(false)
                }
            })
        }).then((value) => {
            return cb(value)
        })
    },
    parseDataInsert: (data) => {
        var arrData = data.map((item) => {
            return `'${item}'`
        })
        return arrData.join(',')
    },

    pasreColumnDataUpdate: (column, data) => {
        let arrData = []
        column.map((el, index) => {
            arrData.push(`${el} = '${data[index]}'`)
        })
        return arrData.join(',')
    },

    parseCondition: (condition) => {
        let strWhere = ''
        if (condition.length > 0) {
            strWhere = 'where '
            condition.map((el, index) => {
                if (index === 0) strWhere = `${strWhere} ${el.key} = '${el.value}'`
                else strWhere = `${strWhere} AND ${el.key} = '${el.value}'`
            })
            return strWhere
        }
    },

    parseConditionDeletes: (condition) => {
        let strWhere = ''
        if (condition.length > 0) {
            var arrColumn = []
            var arrValue = []
            condition.map((el, index) => {
                if (index === 0) {
                    arrColumn.push(el.key)

                    el.value.map((e, i) => {
                        let strV = `(${e})`
                        arrValue.push(strV)
                    })
                }
            })
            let strColumn = arrColumn.join(',')
            let strValue = arrValue.join(',')
            return `where (${strColumn}) IN (${strValue})`
        } else {
            return null
        }
    },

    sqlInsert: (strColumn, strData, table, cb) => {
        var sql = `Insert into ${table} (${strColumn}) values (${strData})`
        utility.excuteQueryAction(sql, cb)
    },

    sqlUpdate: (strValue, strCondition, table, cb) => {
        var sql = `update ${table} SET ${strValue} ${strCondition}`
        utility.excuteQueryAction(sql, cb)
    },

    sqlDelete: (strCondition, table, cb) => {
        var sql = `DELETE FROM ${table} ${strCondition}`
        utility.excuteQueryAction(sql, cb)
    },

    excuteQueryAction: (sql, cb) => {
        connect(sql, true, function (err, results, fields) {
            if (err) return cb('excute fail')
            else {
                if (results && results.affectedRows) {
                    if (results.affectedRows === 1) {
                        return cb(null, results)
                    } else {
                        return cb(null, { code: 201, msg: 'change nothing' })
                    }

                } else if (results && results.affectedRows === 0) {
                    return cb('excute fail')
                } else { return cb('excute fail') }
            }
        })
    },

    excuteQuery: (sql, cb) => {
        connect(sql, true, function (err, results, fields) {
            if (err) cb('excute fail')
            else {
                if (results) cb(null, results)
                else cb(null, [])
            }
        })
    },

    excuteQueryStore: (sql, params = true, cb) => {
        connect(sql, params, function (err, results, fields) {
            if (err) cb('excute fail')
            else {
                if (results && results.length > 1) {
                    results.splice((results.length - 1), 1)
                    cb (null, results)
                } else {
                    cb(null, results)
                }
            }
        })
    },

    excute: (sql, params = true, cb) => {
        connect(sql, params, (err, results, fields) => {
            if (err) cb('excute fail')
            else {
                if (results) cb(null, results)
                else cb(null, null)
            }
        })
    },

    parseDataUpdateToSql: (table, params, condition) => {
        try {
            arrData = []
            for (var key in params) {
                if (params[key] === 'CURRENT_TIMESTAMP') {
                    arrData.push(`${key} = ${params[key]}`)
                } else {
                    arrData.push(`${key} = '${params[key]}'`)
                }
            }
            if (arrData.length === 0) {
                return ''
            }

            var dataSet = arrData.join(',')
            var strCondition = utility.parseCondition(condition)

            var sql = `UPDATE ${table} SET ${dataSet} ${strCondition}`
            return sql
        } catch (err) {
            return null
            console.log(err)
        }
        
    }

}

module.exports = utility
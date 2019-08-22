var connect = require('./excute')
var StringBuilder = require('stringbuilder')
StringBuilder.extend('string')

var async = require('async')

var action = {
  insert: (table, params, cb) => {
    try {
      var sql = `INSERT INTO ${table} SET ?`
      connect.excuteSql(sql, params, (err, result) => {
        if (err) {
          global.logger.error('insert error: ' + err.toString())
          return cb(err)
        } else {
          if (result && result.insertId > 0) cb(null, true)
          else return cb(new Error('fail'))
        }
      })
    } catch (error) {
      global.logger.error('insert catch : ' + error.toString())
      return cb(new Error('insert function: server error'))
    }
  },

  update: (table, params, condition, callback) => {
    try {
      let updatedata = (cb) => {
        let sql = parseDataUpdateToSqlWithStringCondition(table, params, condition)
        connect.excuteSql(sql, false, (err, result) => {
          if (err) return cb(err)
          else return cb(null, result)
        })
      }

      let getData = (result, cb) => {
        if (result && result.affectedRows > 0) {
          let sql = String.format(`Select * from {0} where {1}`, table, condition)

          connect.excuteSql(sql, [true], (err, resp) => {
            if (err) cb(err)
            else {
              if (resp) {
                if (resp[0]) cb(null, resp[0])
                else return cb(null, null)
              } else return cb(new Error('fail'))
            }
          })
        } else return cb(new Error('update fail'))
      }

      async.waterfall([updatedata, getData], (error, data) => {
        if (error) return callback(error)
        return callback(null, data)
      })
    } catch (error) {
      return callback(new Error('update function: server error'))
    }
  },

  delete: (table, condition, cb) => {
    try {
      if (!condition) cb(new Error('fail'))
      var sql = `DELETE FROM ${table} WHERE ${condition}`
      connect.excuteSql(sql, true, (err, result) => {
        if (err) cb(err)
        else {
          if (result && result.affectedRows > 0) cb(null, true)
          else cb(new Error('fail'))
        }
      })
    } catch (error) {
      cb(new Error('delete function: server error'))
    }
  },

  whereItem: (select, table, condition, orderBy, cb) => {
    try {
      var sql = `Select ${select} from ${table} Limit 1`
      if (condition) {
        if (orderBy) {
          sql = String.format(`Select {0} from ${table} where {1} ORDER BY {2} Limit 1`, select, condition, orderBy)
        } else {
          sql = String.format(`Select {0} from ${table} where {1} Limit 1`, select, condition)
        }
      }
      connect.excuteSql(sql, [true], (err, result) => {
        if (err) cb(err)
        else {
          if (result) {
            if (result[0]) cb(null, result[0])
            else return cb(null, null)
          } else return cb(new Error('fail'))
        }
      })
    } catch (err) {
      return cb(new Error('whereItem function: server error'))
    }
  },

  where: (select, table, condition, orderBy, limit, cb) => {
    try {
      var sql = `Select ${select} from ${table} Limit 1`
      if (condition) {
        sql = String.format(`Select {0} from ${table} where {1}`, select, condition)
      }

      if (orderBy) sql = sql + ' ORDER BY ' + orderBy // append string order by

      if (limit) sql = sql + limit // append string limit
      connect.excuteSql(sql, [true], (err, result) => {
        if (err) cb(err)
        else {
          if (result) {
            cb(null, result)
          } else return cb(new Error('fail'))
        }
      })
    } catch (err) {
      return cb(new Error('where function: server error'))
    }
  },

  excuteQueryStore: (sql, params = true, cb) => {
    try {
      connect.excuteSql(sql, params, (err, results, fields) => {
        if (err) {
          return cb(new Error('excuteQueryStore: excute fail'))
        } else {
          if (results && results.length > 1) {
            results.splice((results.length - 1), 1)
            return cb(null, results)
          } else {
            return cb(null, results)
          }
        }
      })
    } catch (error) {
      return cb(new Error('excuteQueryStore function: server error'))
    }
  }
}

var parseDataUpdateToSqlWithStringCondition = (table, params, condition) => {
  try {
    let arrData = []
    for (var key in params) {
      if (params[key] === 'CURRENT_TIMESTAMP') {
        arrData.push(`${key} = ${params[key]}`)
      } else {
        let val = params[key].toString().replace(/'/g, '\\\'')
        arrData.push(`${key} = '${val}'`)
      }
    }
    if (arrData.length === 0) {
      return ''
    }
    var dataSet = arrData.join(',')
    var sql = `UPDATE ${table} SET ${dataSet} where ${condition}`
    return sql
  } catch (err) {
    return null
  }
}

module.exports = action

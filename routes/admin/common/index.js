var authUser = require('../../../controller/authenticate/autuser')
var mysql = require('../../../model/mysql')
var store = mysql.store
var upload_image = require('../../../helper/image_upload')
var sha256 = require('sha256')
const async = require('async')

module.exports = function (router) {
  router.post('/image_upload', function (req, res) {
    upload_image(req, function (err, data) {
      if (err) return res.status(404).end(JSON.stringify(err))
      else res.send(data)
    })
  })

  router.get('/update', function (req, res) {
    handleUpdate(req.query, function (err, result) {
      if (err) {
        res.status(500).json({ status: 500, message: err })
      } else {
        if (result && result.affectedRows && result.affectedRows === 1) {
          res.status(200).json({ status: 200, message: 'success', data: result })
        } else {
          res.status(500).json({ status: 500, message: err })
        }
      }
    })

  })

  router.get('/delete', authUser.checkTokenAdmin, (req, res) => {
    if (!req.query.code || req.query.code.trim() === '') {
        res.status(500).json({ status: 500, message: 'column doen\'t exits'})
        res.end()
    } else if (!req.query.table || req.query.table.trim() === '') {
      res.status(500).json({ status: 500, message: 'table doen\'t exits'})
        res.end()
    } else {
      handleDelete(req.query.code, req.query.table, res)
    }
  })
}

var handleDelete = (code, table, res) => {
  mysqlHelper.checkTable(table, (result) => {
    if (!result) {
      res.status(500).json({ status: 500, message: 'table doen\'t exits'})
      res.end()
    } else {
      var condition = [{key : 'code', value: [`'${code}'`]}]
      mysqlHelper.action({condition: condition, table: table}, 'delete', (err, _result) => {
        if (err) {
          res.status(500).json({ status: 500, message: 'delete fail'})
          res.end()
        } else {
          if (_result && _result.affectedRows > 0) {
            res.status(200).json({ status: 200, message: 'success'})
            res.end()
          } else {
            res.status(500).json({ status: 500, message: 'delete fail'})
            res.end()
          }
        }
      })
    }
  })
}

function handleDelete (dt, calback) {
  var { table, code } = dt
}

function handleUpdate(dt, callback) {
  var { table, columns, data, where } = dt

  function getColumnsTable(cbk) {
    mysql.lib.query('SHOW COLUMNS FROM `ta-ecommerce`.' + table, true, (err, results, fields) => {
      var arr = []
      if (err) {
        return cbk(err)
      } else {
        results.map((v, k) => { arr.push(v.Field) })
        return cbk(null, arr)
      }
    })
  }

  function checkColumn(arrColumns, cbk) {
    let cols = columns.split(',')
    let arrData = data.split(',')
    if (cols.length > 0) {
      var flag = true
      cols.map((v, k) => {
        var index = arrColumns.findIndex((el) => el.toLowerCase() === v.toLowerCase())
        if (index < 0) {
          flag = false
        }
      })
      if (!flag) return cbk('colums not match')
      else return cbk(null, cols, arrData)
    }
  }

  function joinString(cols, arrData, cbk) {
    if (cols.length !== arrData.length) {
      return cbk('colums and data not match')
    }
    let arrMap = []
    cols.map((v, k) => {
      var value = arrData[k]
      arrMap.push(` ${v} = '${value}'`)
    })

    var sql = `UPDATE ${table} SET 
		  ${arrMap.join(',')}
		 WHERE ${where}`

    return cbk(null, sql)
  }

  function excuteQuery(sql, cbk) {
    mysql.lib.query(sql, true, (err, results, fields) => {
      if (err) {
        return cbk(err)
      } else {
        return cbk(null, results)
      }
    })
  }

  async.waterfall([getColumnsTable, checkColumn, joinString, excuteQuery], (err, result) => {
    if (err) {
      return callback(err)
    } else {
      return callback(null, result)
    }
  })
}

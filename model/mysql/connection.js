const mysql = require('mysql')
var config = require('./config')

var db = mysql.createPool(config)

var connection = (sql, params, callback) => {
  try {
    db.getConnection(function (err, conn) {
      if (err) {
        console.log(err)
        callback(err)
      } else {
        conn.on('error', function (err) {
          console.log(err)
          return callback(err)
        })

        if (!params) params = null

        conn.query(
          {
            sql: sql,
            timeout: 40000
          },
          params,
          function (qerr, results, fields) {
            if (qerr) {
              callback(qerr)
              return
            }
            conn.release()
            callback(qerr, results, fields)
          }
        )
      }
    })
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
module.exports = connection
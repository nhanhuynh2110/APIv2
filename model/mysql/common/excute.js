let connection = require('../connection')

var excute = {
  excuteSql: (sql, params, cb) => {
    try {
      connection(sql, params, (err, results, fields) => {
        if (err) {
          global.logger.error('excute error: ' + err.toString())
          return cb('connection-mysql: excute fail')
        } else {
          if (results) return cb(null, results)
          else return cb(null, null)
        }
      })
    } catch (error) {
      global.logger.error('excute catch: ' + error.toString())
      return cb('connection mysql : error')
    }
  }
}

module.exports = excute
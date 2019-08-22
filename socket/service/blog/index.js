let mysql = require('../../../model/mysql')

module.exports = class Blog {
  grid (obj, cb) {
    var Blog = new mysql.service.blog()
    Blog.grid(obj, (err, result) => {
      if (err) return cb(err)
      return cb(null, result)
    })
  }
  update (data, cb) {
    var obj = JSON.parse(data.data)
    var { condition, field } = obj

    if (!condition || !field) {
      let msg = 'request invalid'
      return cb(msg)
    }
    var Blog = new mysql.service.blog()
    Blog.conditionFields(condition)
    Blog.whereItemTableBase(function (err, result) {
      if (err) return cb('fail')
      else {
        if (result) {
          console.log('result', result)
          Blog.setData(field)
          Blog.update((_err, _result) => {
            if (_err) return cb('Server Error')
            else {
              if (_result) return cb(null, result)
              else return cb('fail')
            }
          })
        } else {
          return cb('fail')
        }
      }
    })
  }
}

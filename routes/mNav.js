var db = require('../model/mysql')
var config = require('../config/config')
var models = require('../model/mongo/index')
module.exports = function(router) {
  router.get('/product', function(req, res) {
    db.query(`CALL ${ config.store.MNav }()`, true, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      res.json(results[0])
    })
  })

  router.get('/test', function(req, res) {
    var data = {
      username: 'trung nhan',
      id: '1',
      token: '123'
    }
    models.User.create(data, (err, user) => {
      if (err) {
      } 
      res.send(user)
    })
  })


  router.get('/product-category', function(req, res) {
    var page = parseInt(req.query.pn)
    var pageSize = parseInt(req.query.ps)
    var key = req.query.q
    var offset = (page - 1) * pageSize
    var qSort = 'id'
    var sort = 'ASC'
    var order = ''
    var searchField = null
    if (req.query.s) {
      searchField = JSON.parse(req.query.s)
    }

    var k_search = []
    searchField = searchField.map(function(v, k) {
       return `${v} like "%${key}%"`
    });
    if (req.query.qsort) {
      qSort = req.query.qsort
      sort = req.query.sort
      order = ` Order by ${qSort}`
    }

    var search_key = searchField.join(' or ')
    var store = `call st_get_country(${pageSize},${page},'${sort}','${qSort}',' ${search_key} ')`

    db.query(`SELECT COUNT(id) AS totals FROM viewcountry where ${search_key} ${order}`, true, (err, totals) => {
      if (err) {
        return console.error(error.message);
      }
      db.query(store, true, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        var data = results
        res.status(200).json({
          totals: totals[0].totals,
          data: data 
        })
      })
    })

    
  })
}
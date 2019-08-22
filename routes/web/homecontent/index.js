
var mysql = require('../../../model/mysql')
var config = require('../../../config/config')
var utility = require('../../../helper/utility')
var lib = require('./lib')

module.exports = function(router) {
  router.get('/homecontent', (req, res) => {
    try {
      lib.getAllHomeContent(res)
    } catch (error) {s
      utility.apiResponse(res, 500, 'Server error')
    }
  })

  router.get('/homecontent/:code', (req, res) => {
    try {
      var params = req.params
      if (!params.code) utility.apiResponse(res, 500, 'request invalid')
      lib.getHomeContentByCode(res, params.code)
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  })
}



// var mysql = require('../../../model/mysql')
// var config = require('../../../config/config')
// const async = require('async')

// module.exports = function (router) {
//   router.get('/get-all-home-manager1', function (req, res) {
//     var sql = 'select * from viewhomemanager where is_active = 1 order by layout asc'
//     var dt = []

//     mysql.lib.query(sql, true, (error, results, fields) => {
//       if (error) return console.error(error.message)
//       if (results) {
//         var mapData = new Promise((resolve, reject) => {
//           async.map(results, function(item, callback) {
//             // get blogs from manager home layout
//             var arrblogs = item.blogs.split(',')
//             var strBlogs = ''
//             var arr = arrblogs.map((_v, _k) => `"${_v}"`)
//             var strBlogs = arr.join(',')

//             var _sql = `SELECT * FROM viewbloginfo  WHERE blog_code IN (${strBlogs}) AND blog_is_active=1 AND blog_is_delete=0 order by FIELD (blog_code,${strBlogs});`
            
//             mysql.lib.query(_sql, true, (_err, r, fields) => {
//               if (_err) {
//                 callback('err server')
//               } else {
//                 dt.push({
//                   homeManager: item,
//                   blogs: r
//                 })
//                 callback(null, dt)
//               }
//             })
//           }, function(err, r) {
//               resolve(dt)
//           });
//         });


//         Promise.all([mapData]).then(values => { 
//           res.status(200).json({ status: 200, message: 'success', data: values}) 
//         })
//         .catch(function(err){
//           console.error('Promise.all error', err); 
//           res.status(500).json({ status: 500, message: 'Get home manager fail'})
//         })
//       } else {
//         res.status(200).json({ status: 200, message: 'success', data: [] })
//       }
//     })
//   })
// }

// var getBlogsInList = function (item) {

// }
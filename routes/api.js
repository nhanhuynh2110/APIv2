var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

// router.use(function(req, res, next) {
//   var token = req.body.token || req.headers['token'] || req.query.token
//   if (token) {
//     jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
//       console.log(decode)
//       if (err) {
//         res.status(500).send('Invalid token')
//       } else {
//         next()
//       }
//     })
//   } else{
//     res.send('please send a token')
//   }
// })

require('./mNav')(router)


module.exports = router

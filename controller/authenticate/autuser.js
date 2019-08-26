var jwt = require('jsonwebtoken')
// var CryptoJS = require('cryptojs')
var sha256 = require('sha256')
var Models = require('../../model/mongo')

var getToken = (username, password) => {
  var now = Date.now()
  var user = {
    username: username,
    password: password,
    date: now
  }
  var token = jwt.sign(user, process.env.SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: 4000
  })
  return sha256(token)
}

var checkToken = (req, res, next) => {
  if (req.body['token'] || req.headers['token'] || req.query['token']) {
    var token = req.body['token'] || req.headers['token'] || req.query['token']
    var ip = req.connection.remoteAddress
    Models.Token.findOne({token, ip}, (err, mytoken) => {
      if (err) return res.status(500).json({message: 'server error'})
      if (mytoken) {
        req['token'] = token
        next()
      } else return res.status(500).json({message: 'token is not valid'})
    })
  } else return res.status(404).json({ message: 'token is not valid' })
}

exports.getToken = getToken
exports.checkTokenAdmin = checkToken

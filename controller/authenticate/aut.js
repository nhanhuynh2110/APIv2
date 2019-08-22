var jwt = require('jsonwebtoken')

module.exports.getToken = (req, res) => {
  var user = {
    username: 'ta',
    email: 'ta@gmail.com'
  }
  var token = jwt.sign(user, process.env.SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: 4000
  })
  res.json({
    success: true,
    token: token
  })
}

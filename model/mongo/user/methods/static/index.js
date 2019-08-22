const create = function (data, ip, cbk) {
  var { username, id, token, code } = data
  var _newuser = {
    username: username,
    userId: id,
    token: token,
    ip: ip,
    userCode: code
  }
  const newUser = new this(_newuser)
  newUser.save((err, user) => {
    if (err) {
      return cbk(err)
    }
    return cbk(err, user)
  })
}

const staticMethods = {
  create
}

module.exports = staticMethods

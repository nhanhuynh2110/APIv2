var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
var sha256 = require('sha256')

var lib = {
  insertRow: (res, form) => {
    try {
      var params = {
        code: utility.generateCode(),
        username: form.username,
        email: form.email,
        password: sha256(form.password),
        avatar: form.avatar,
        firstname: form.firstname,
        lastname: form.lastname,
        fullname: form.fullname,
        birthday: form.birthday,
        address: form.address,

        phone: form.phone,
        facebook: form.facebook,
        google: form.google,
        gender: form.gender,
        identity_card: form.identity_card,
        hometown: form.hometown,

        is_active: form.is_active,
        is_delete: 0
      }
      var account = new mysql.service.account()
      account.setData(params)
      account.save(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success')
          else utility.apiResponse(res, 500, 'insert fail')
        }
      })
    } catch (err) {
      utility.apiResponse(res, 500, 'server error')
    }
  },
  updateRow: (res, form) => {
    try {
      var params = {
        code: form.code,
        username: form.username,
        email: form.email,
        avatar: form.avatar,
        firstname: form.firstname,
        lastname: form.lastname,
        fullname: form.fullname,
        birthday: form.birthday,
        address: form.address,
        phone: form.phone,
        facebook: form.facebook,
        google: form.google,
        gender: form.gender,
        identity_card: form.identity_card,
        hometown: form.hometown,

        is_active: form.is_active,
        is_delete: 0
      }
      var account = new mysql.service.account()
      account.conditionString(`code = '${params.code}'`)
      account.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            account.setData(params)
            account.update((err, result) => {
              if (err) utility.apiResponse(res, 500, 'Server error')
              if (result) utility.apiResponse(res, 200, 'success')
              else utility.apiResponse(res, 500, 'update fail')
            })
          } else {
            utility.apiResponse(res, 500, 'Category not found')
          }
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  grid: (res, obj) => {
    try {
      var account = new mysql.service.account()
      account.filterGridColumns({ is_delete: obj.isDel })
      account.gridCommon(obj, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          utility.apiResponse(res, 200, 'success', result)
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  getByCode: (res, code) => {
    try {
      var account = new mysql.service.account()
      account.conditionString(`code = '${code}'`)
      account.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  update: (res, condition, params) => {
    try {
      var account = new mysql.service.account()
      account.conditionFields(condition)
      account.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            account.setData(params)
            account.update((_err, _result) => {
              if (_err) utility.apiResponse(res, 500, _err)
              else {
                if (_result) utility.apiResponse(res, 200, 'success', _result)
                else utility.apiResponse(res, 500, 'update fail')
              }
            })
          } else {
            utility.apiResponse(res, 500, 'Account not found')
          }
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  delete: (res, condition) => {
    try {
      var account = new mysql.service.account()
      account.conditionFields(condition)
      account.delete((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success', result)
          else utility.apiResponse(res, 500, 'update fail')
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', error.toString())
    }
  },

  checkUserOrEmail: (res, form, type) => {
    try {
      if (!form.user) {
        utility.apiResponse(res, 500, `request invalid`, null)
      } else {
        // console.log(333)
        _checkUserNameOrEmail(form.code, form.user, type, (err, result) => {
          console.log(err, result)
          if (err) utility.apiResponse(res, 500, 'Server error')
          else utility.apiResponse(res, 200, 'success', result)
        })
      }
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, 'Server error')
    }
  },

  checkPassword: (res, form) => {
    try {
      if (!form.code || !form.password) utility.apiResponse(res, 500, `request invalid`, null)
      _checkPassWord(form.code, form.password, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'Server error')
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, 'Server error')
    }
  },

  changePassword: (res, form) => {
    try {
      if (!form.code || !form.passwordOld || !form.password || !form.confirmPassword) {
        utility.apiResponse(res, 500, 'request invalid')
      }

      _checkPassWord(form.code, form.passwordOld, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'Server error')
        else {
          if (!result) utility.apiResponse(res, 500, 'PasswordOld not match')
          else {
            var account = new mysql.service.account()
            account.conditionFields({
              code: form.code
            })
            account.whereItem(function (error, result1) {
              if (error) utility.apiResponse(res, 500, 'server error')
              else {
                if (result1) {
                  var params = {
                    password: sha256(form.password)
                  }
                  account.setData(params)
                  account.update((_err, _result) => {
                    if (_result) utility.apiResponse(res, 200, 'success', _result)
                    else utility.apiResponse(res, 500, 'update fail')
                  })
                } else {
                  utility.apiResponse(res, 500, 'Category not found')
                }
              }
            })
          }
        }
      })
    } catch (error) {
      console.log(error)
      utility.apiResponse(res, 500, 'Server error')
    }
  }
}

function _checkPassWord(code, pass, cb) {
  try {
    let password = sha256(pass)
    var _account = new mysql.service.account()
    _account.conditionFields({
      code: code,
      password: password,
      is_active: 1,
      is_delete: 0
    })
    _account.whereItem((err, result) => {
      if (err) {
        let msg = 'Server error'
        return cb(msg)
      }
      else {
        if (result) return cb(null, true)
        else return cb(null, false)
      }
    })
  } catch (error) {
    let msg = 'Server error'
    return cb(msg)
  }
}


// type 1: username, type 2: email
function _checkUserNameOrEmail(code, userOrEmail, isType, cb) {
  try {
    var _account = new mysql.service.account()
    if (code) {
      _account.conditionFields({
        code: code
      })
      _account.whereItem((err, result) => {
        let msg = 'Server error'
        if (err) return cb(msg)
        else {
          if (!result) {
            handleCheckUsernameOrEmail(isType, userOrEmail, _account, cb)
          } else {
            var compareUser = (isType === 1) ? result.username === userOrEmail : result.email === userOrEmail
            if (compareUser) return cb(null, false)
            else {
              handleCheckUsernameOrEmail(isType, userOrEmail, _account, cb)
            }
          }
        }
      })
    } else {
      handleCheckUsernameOrEmail(isType, userOrEmail, _account, cb)
    }
  } catch (error) {
    let msg = 'Server error'
    return cb(msg)
  }
}

function handleCheckUsernameOrEmail (isType, userOrEmail, _account, cb) {
  if (isType === 1) {
    _account.conditionFields({
      username: userOrEmail
    })
  } else {
    _account.conditionFields({
      email: userOrEmail
    })
  }
  _account.whereItem((_err, _result) => {
    if (_err) {
      let msg = 'Server error'
      return cb(msg)
    } else {
      if (_result) return cb(null, true)
      else return cb(null, false)
    }
  })
}

module.exports = lib

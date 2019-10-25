const _ = require('lodash')

module.exports = (e, status = 500, code) => {
  const err = {
    code: code || e.code,
    status,
    title: e.message,
    detail: process.env.NODE_ENV === 'development' && e.stack ? e.stack : ''
  }
  return err
}

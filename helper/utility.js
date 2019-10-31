var sha256 = require('sha256')
var secretKey = 'TAWL'

var utility = {
  generateCode: () => {
    return sha256(secretKey + Date.now().toString())
  },
  offset: (pageSize = 10, pageNumber = 1) => {
    let limit = parseInt(pageSize) * (parseInt(pageNumber) - 1)
    return `limit ${limit},${pageSize}`
  },
  sort: (a, b) => {
    if (a.layout < b.layout) return -1
    if (a.layout > b.layout) return 1
    return 0
  },
  apiResponse: (res, status, msg, data = null) => {
    res.status(status).json({ status: status, message: msg, data: data })
    res.end()
  },
  formatLink: (str) => {
    return str.trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/[ ]/g, '-')
      .toLowerCase()
  },
  runParrallel: (tasks, ...args) => Promise.all(tasks.map(task => task(...args)))
}
module.exports = utility

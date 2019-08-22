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
    str = str.trim()
    if (str !== undefined && str !== null && str !== '') {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      str = str.replace(/đ/g, 'd')
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
      str = str.replace(/Đ/g, 'D')
      str = str.replace(/[,%:_*&|<>;+\\?^${}/()|[\]\\]/g, '-')
      str = str.replace(/ /g, '-')
      str = str.replace(/---/g, '-')
      str = str.replace(/--/g, '-')
      str = str.toLowerCase()
      // if (/[,%:_*|<>;+\\?^${}/()|[\]\\]/.test(str)) {
      //   str = str.substring(0)
      // }
      return str
    }
  }
}
module.exports = utility

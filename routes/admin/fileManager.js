const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
const path = require('path')

const authUser = require('../../controller/authenticate/autuser')
const utility = require('../../helper/utility')
const rootPath = './uploads/file-manager/'

module.exports = function (router) {

  router.post('/file-manager', authUser.checkTokenAdmin, (req, res) => {
    try {
      console.log(req.body)
      const {dirPath} = req.body
      if (!dirPath) return utility.apiResponse(res, 500, 'dirPath is invalid')
      // if (fs.existsSync(rootPath + dirPath)) return utility.apiResponse(res, 500, 'folder-exits')
      if (!fs.existsSync(rootPath + dirPath)) {
        fs.mkdir(rootPath + dirPath, (err) => {
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'success', true)
        })
      }
      return utility.apiResponse(res, 500, 'create folder fail')
    } catch (error) { 
      console.log('error', error)
      utility.apiResponse(res, 500, error.toString(), null)
    }
  })
}

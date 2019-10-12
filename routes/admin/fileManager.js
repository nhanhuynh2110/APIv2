const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
var rimraf = require('rimraf')
const path = require('path')

const authUser = require('../../controller/authenticate/autuser')
const utility = require('../../helper/utility')
const rootPath = './uploads/file-manager'

const routePrefix = '/file-manager'

module.exports = function (router) {
  router.post(routePrefix, authUser.checkTokenAdmin, (req, res) => {
    try {
      const {dirPath} = req.body
      if (!dirPath) return utility.apiResponse(res, 500, 'dirPath is invalid')
      if (!fs.existsSync(rootPath + dirPath)) {
        fs.mkdir(rootPath + '/' + dirPath, (err) => {
          
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'success', true)
        })
      } else {
        return utility.apiResponse(res, 500, 'create folder fail')
      }
    } catch (error) { return utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get(routePrefix, authUser.checkTokenAdmin, (req, res) => {
    try {
      const {dirPath} = req.query
      const dir = dirPath ? rootPath + '/' + dirPath : rootPath
      if (!fs.existsSync(dir)) return utility.apiResponse(res, 500, 'dirPath is invalid')
      const folders = []
      const files = []

      fs.readdir(dir, (err, filesOrFolder) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        filesOrFolder.forEach(file => {
          if (fs.lstatSync(`${dir}/${file}`).isDirectory()) folders.push({ name: file })
          else files.push({ name: file })
        })

        return utility.apiResponse(res, 200, 'success', { folders, files })

      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.delete(`${routePrefix}`, authUser.checkTokenAdmin, (req, res) => {
    try {
      const {path} = req.body
      if (!path) return utility.apiResponse(res, 500, 'dirPath is invalid')
      if (!fs.existsSync(rootPath + '/' + path)) {
        return utility.apiResponse(res, 500, 'dirPath is invalid')
      } else {
        rimraf(rootPath + '/' + path, function (err, data) {
          return utility.apiResponse(res, 200, 'Sucess', true)
        })
      }
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) } 
  })
}

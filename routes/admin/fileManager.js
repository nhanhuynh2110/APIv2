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
  router.get(routePrefix + '/file', (req, res) => {
    // console.log('req.query', req.query)
    // const file = `${rootPath}/${req.query.path}`
    // console.log('file', file)
    utility.apiResponse(res, 200, 'success', true)
    // res.send(file)
  })

  router.put(routePrefix + '/:name', authUser.checkTokenAdmin, (req, res) => {
    try {
      const {name} = req.params
      const {dirPath, currentName} = req.body
      const pathDir = dirPath ? rootPath + '/' + dirPath + '/' + name : rootPath + '/' + name
      const pathDirCurrent = dirPath ? rootPath + '/' + dirPath + '/' + currentName : rootPath + '/' + currentName

      if (!fs.existsSync(pathDirCurrent)) return utility.apiResponse(res, 500, 'dirPath is invalid!!')
      if (fs.existsSync(pathDir)) {
        return utility.apiResponse(res, 500, 'dirPath is exist!!')
      } else {
        fs.rename(pathDirCurrent, pathDir, (err) => {
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'success', true)
        })
      }
    } catch (error) { return utility.apiResponse(res, 500, error.toString(), null) }
  })

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
      const {paths} = req.body
      if (!paths) return utility.apiResponse(res, 500, 'dirPath is invalid')
      const task = []

      paths.forEach(p => {
        task.push(new Promise(function (resolve, reject) {
          if (!fs.existsSync(rootPath + '/' + p)) reject(new Error('path invalid'))
          else rimraf(rootPath + '/' + p, () => resolve())
        }).then(() => true).catch(() => false))
      })

      Promise.all(task).then(() => utility.apiResponse(res, 200, 'Sucess', true))
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const fs = require('fs')
const sha1 = require('sha1')
const formidable = require('formidable')
require('./config/appConfig')(app)
let config = require('./config/config')

global.rootDirectory = __dirname
global.logger = require('./logger').createLogger('./log.txt') // define log 
global.logger.error('abc')
const getExtension = (filename) => filename.split('.').pop()

const isImageValid = (filename, mimetype) => {
  var allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob']
  var allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
  var extension = getExtension(filename)
  return allowedExts.indexOf(extension.toLowerCase()) != -1 && allowedMimeTypes.indexOf(mimetype) != -1
}

app.post('/upload', (req, res) => {
  const { folder } = req.query

  var _dir = folder ? path.join(`${global.rootDirectory}/uploads/${folder}`) : path.join(`${global.rootDirectory}/uploads`)
  if (!fs.existsSync(_dir)) fs.mkdirSync(_dir)

  let images = []

  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.multiples = true
    form.uploadDir = _dir

    form.parse(req).on('fileBegin', (name, file) => {
      
      if (!isImageValid(file.name, file.type)) reject(`${file.name} invalid`)
    }).on('file', function (name, file) {
      const fileRoute = folder ? `/${folder}/` : '/'
      const randomName = sha1(new Date().getTime() + file.name) + '.' + getExtension(file.name)
      images.push({ link: config.domain + fileRoute + randomName, img: fileRoute + randomName })
      fs.rename(file.path, path.join(form.uploadDir, randomName), (err) => {
        if (err) reject(err)
        return
      })
    }).on('error', reject).on('end', resolve)
  })
  .then(() => res.status(200).json({ status: 200, message: 'success', data: images }))
  .catch((error) => res.status(500).json({ status: 500, message: error.toString() }))
})

require('./socket/connection')(io)
server.listen(config.PORT, () => global.logger.info(`start server ${config.PORT} success`))

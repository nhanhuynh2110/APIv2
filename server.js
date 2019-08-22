var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var path = require('path')
var fs = require('fs')
var sha1 = require('sha1')
require('./config/appConfig')(app)
let config = require('./config/config')

global.rootDirectory = __dirname
global.logger = require('./logger').createLogger('./log.txt') // define log app

var formidable = require('formidable')

function getExtension (filename) {
  return filename.split('.').pop()
}

function isImageValid (filename, mimetype) {
  var allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob']
  var allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']

  // Get image extension.
  var extension = getExtension(filename)

  return allowedExts.indexOf(extension.toLowerCase()) != -1 &&
    allowedMimeTypes.indexOf(mimetype) != -1
}

app.post('/upload', function (req, res) {
  var { folder } = req.query
  console.log('folder', folder)
  var _dir = path.join(`${global.rootDirectory}/uploads`)
  if (req.query.folder) {
    _dir = path.join(`${global.rootDirectory}/uploads/${folder}`)
    console.log('req.query.folder', `${global.rootDirectory}/uploads/${folder}`)
    if (!fs.existsSync(_dir)) {
      fs.mkdirSync(_dir)
    }
  }
  // create an incoming form object
  var form = new formidable.IncomingForm()
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true

  // store all uploads in the /uploads directory
  form.uploadDir = _dir

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  var link = ''
  var fileRoute = ''
  var randomName = ''
  var filename = ''
  form.on('file', function (field, file) {
    // fileRoute = '/uploads/'
    fileRoute = '/'
    if (folder) fileRoute = fileRoute + folder + '/'
    var id = sha1(new Date().getTime())
    randomName = id + '.' + getExtension(file.name)
    // link = 'http://' + req.get('host') + fileRoute + randomName
    link = config.domain + fileRoute + randomName
    fs.rename(file.path, path.join(form.uploadDir, randomName), (err) => {
      if (err) throw new Error(err)
    })
  })

  // log any errors that occur
  form.on('error', () => {
    res.status(500).json({
      status: 500,
      message: `upload image ${filename} fail!`,
      data: {
        link: link,
        img: fileRoute + randomName
      }
    })
  })

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    console.log('fileRoute + randomName', fileRoute + randomName)
    res.status(200).json({
      status: 200,
      message: 'success',
      data: {
        link: link,
        img: fileRoute + randomName
      }
    })
  })

  // parse the incoming request containing the form data
  form.parse(req)
})
// app.listen(3100)
app.get('/', function (req, res, next) {
  res.sendFile(global.__dirname + '/index.html')
})

require('./socket/connection')(io)
server.listen(3100, () => {
  global.logger.info('start server 3100 success')
})

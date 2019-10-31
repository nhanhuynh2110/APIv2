const path = require('path')
const formidable = require('formidable')
const fs = require('fs')
const sha1 = require('sha1')

const {domain} = require('../../config/config')

const getExtension = (filename) => filename.split('.').pop()

const isImageValid = (filename, mimetype) => {
  var allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob']
  var allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
  var extension = getExtension(filename)
  return allowedExts.indexOf(extension.toLowerCase()) !== -1 && allowedMimeTypes.indexOf(mimetype) !== -1
}

module.exports = (app) => {
  app.get('/download', (req, res) => {
    fs.readFile(path.resolve(`./uploads/file-manager/${req.query.path}`), (err, data) => {
      if (err) return res.end(null)
      return res.end(data)
    })
  })

  app.post('/upload-file-manager', (req, res) => {
    const { folder } = req.query

    var _dir = folder ? path.resolve(`./uploads/${folder}`) : path.resolve(`./uploads`)
    if (!fs.existsSync(_dir)) fs.mkdirSync(_dir)
    let images = []

    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.multiples = true
      form.uploadDir = _dir

      form.parse(req).on('fileBegin', (name, file) => {
        if (!isImageValid(file.name, file.type)) reject(new Error(`${file.name} is invalid`))
      }).on('file', function (name, file) {
        const fileRoute = folder ? `/${folder}/` : '/'
        images.push({ link: domain + fileRoute + file.name, img: fileRoute + file.name })
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => { if (err) reject(err) })
      }).on('error', reject).on('end', resolve)
    })
      .then(() => res.status(200).json({ status: 200, message: 'success', data: images }))
      .catch((error) => res.status(500).json({ status: 500, message: error.toString() }))
  })

  app.post('/upload', (req, res) => {
    const { folder } = req.query

    var _dir = folder ? path.resolve(`./uploads/${folder}`) : path.resolve(`./uploads`)
    if (!fs.existsSync(_dir)) fs.mkdirSync(_dir)
    let images = []

    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.multiples = true
      form.uploadDir = _dir

      form.parse(req).on('fileBegin', (name, file) => {
        if (!isImageValid(file.name, file.type)) reject(new Error(`${file.name} is invalid`))
      }).on('file', function (name, file) {
        const fileRoute = folder ? `/${folder}/` : '/'
        const randomName = sha1(new Date().getTime() + file.name) + '.' + getExtension(file.name)
        images.push({ link: domain + fileRoute + randomName, img: fileRoute + randomName })
        fs.rename(file.path, path.join(form.uploadDir, randomName), (err) => { if (err) reject(err) })
      }).on('error', reject).on('end', resolve)
    })
      .then(() => res.status(200).json({ status: 200, message: 'success', data: images }))
      .catch((error) => res.status(500).json({ status: 500, message: error.toString() }))
  })
}

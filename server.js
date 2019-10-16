const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
require('./config/appConfig')(app)
let config = require('./config/config')

global.rootDirectory = __dirname
global.logger = require('./logger').createLogger('./log.txt') // define log
global.logger.error('abc')

require('./socket/connection')(io)
server.listen(config.PORT, () => global.logger.info(`start server ${config.PORT} success`))

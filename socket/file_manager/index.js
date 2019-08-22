const lib = require('./lib')
const path = require('path')

module.exports = (socket) => {
    socket.on('get-folders', (folder = null) => {
        var _dirFolder = path.join(`${rootDirectory}/uploads`)
        if (folder) _dirFolder = path.join(`${rootDirectory}/${folder}`)
        if (lib.checkFolders(_dirFolder)) {
            lib.getFolders(_dirFolder, (results) => {
                socket.emit('response-get-folders', results)
            })
        }
    })
}
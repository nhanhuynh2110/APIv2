const fs = require('fs')
const path = require('path')

var lib = {
    checkFolders: (_dir) => {
        return fs.existsSync(_dir)
    },
    getFolders: (_dir, cb) => {
        var findFile, results, rootDir;
        results = []
        
        findFile = () => {
            fs.readdirSync(_dir).forEach(function(file) {
                if (file !== '.DS_Store') {
                    var pathFolder = path.join(`${rootDirectory}/uploads/${file}`)
                    if (lib.checkFolders(pathFolder)) {
                        if (fs.lstatSync(pathFolder).isDirectory()) {
                            results.push({ route: 'uploads/' + file, value: file, type: 'dir'})
                        } else {
                            results.push({ route: 'uploads/' + file, value: file, type: 'file'})
                        }
                    }
                }
            })
        }
        findFile()
        cb(results)
    }
}

module.exports = lib
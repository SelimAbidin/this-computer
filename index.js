const fs = require('fs')
const {join} = require('path')
const os = require('os');
var spawn = require('child_process').spawn


function FolderObject(name, path) {
    return {
        name : name,
        path : path
    }
}


function listFolder(folder) {
    
    return new Promise( (resolve, reject) => {

        fs.readdir(__dirname, (err, files) => {

            if(err) {
                reject(err)
            }

            let folders = [
                FolderObject('..', join(folder, '..'))
            ]

            
            for (let i = 0; i < files.length; i++) {
                let folder = FolderObject(files[i], join(folder, files[i]) )
                folders.push(folder)
            }
            
            var resultObject = {
                baseFolder : folder,
                subFiles : folders
            }

            resolve(resultObject)
        })

    })
}

function listPathByRef(path, ref) {
    let newPath = join(path , ref)
    return listFolder(newPath)
}


function windowsVolumes() {
    
   return new Promise((resolve , reject) => {

        var list  = spawn('cmd')
        
        var fullData = ''
        list.stdout.on('data', function (data) {
            fullData += data
        });

            
        list.stderr.on('data', function (data) {
            reject(new Error(data))
        });

        list.stdout.on('close', function (data) {

            var data = fullData.split('\r\n')
            data = data.splice(4,data.length - 7)
            data = data.map(Function.prototype.call, String.prototype.trim)

            var resultObject = {
                baseFolder : 'This Computer',
                subFiles : data
            }

            resolve(resultObject)
        });
            
        list.stdin.write('wmic logicaldisk get name\n')
        list.stdin.end()
   })
}

function volumes() {
    
    if(os.platform() === 'win32') {
        return windowsVolumes()
    } else {
        return listFolder('/')
    }

}

module.exports = {
    volumes : volumes,
    windowsVolumes : windowsVolumes,
    listPathByRef : listPathByRef,
    listFolder : listFolder
}
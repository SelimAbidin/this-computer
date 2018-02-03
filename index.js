const fs = require('fs')
const {join, normalize} = require('path')
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

        let normalizedPath = normalize(folder)
        fs.readdir(normalizedPath, (err, files) => {

            if(err) {
                reject(err)
                return
            }

            let folders = [
                FolderObject('..', normalize(join(normalizedPath, '..')))
            ]

            
            for (let i = 0; i < files.length; i++) {
                let path = join(folder, files[i])
                let folderObject = FolderObject(files[i], path )
                folders.push(folderObject)
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

            let folderObjects = []

            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                folderObjects.push(FolderObject(element, element))
            }

            var resultObject = {
                baseFolder : 'This Computer',
                subFiles : folderObjects
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
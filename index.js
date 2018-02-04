const {readdir, lstatSync} = require('fs')
const {join, normalize, format, parse} = require('path')
const os = require('os');
var spawn = require('child_process').spawn


function FolderObject(name, path) {
    return {
        name : name,
        path : path
    }
}


function isFolderSync(source) {
    return lstatSync(source).isDirectory()
}

function isRootSync(path) {
    let parsedPath = parse(path)
    return parsedPath.root === parsedPath.dir && parsedPath.base.length === 0 && parsedPath.ext.length === 0
}

function listFolder(folder) {
    
    return new Promise( (resolve, reject) => {

        let fpath = folder
        let isRoot = isRootSync(folder)
        if(isRoot) {
            
            if(os.platform() === 'win32') {
                
                if(fpath[fpath.length - 1] === ':') {
                    fpath += '\\' 
                }
            }

        }
        
        let normalizedPath = normalize(fpath)

        readdir(normalizedPath, (err, files) => {

            if(err) {
                reject(err)
                return
            }

            let folders = []

            if(!isRoot) {
                folders.push(FolderObject('..', normalize(join(normalizedPath, '..'))))
            } else {
                
                if(os.platform() === 'win32') {
                    folders.push(FolderObject('This Computer', ''))
                } else {
                    folders.push(FolderObject('Root', ''))
                }
            }
            
            for (let i = 0; i < files.length; i++) {
                let path = join(folder, files[i])
                
                let isFolder
                try {
                    isFolder = isFolderSync(path)
                } catch (error) {
                    console.log('error : isFolderSync');
                }

                if(isFolder) {
                    let folderObject = FolderObject(files[i], path )
                    folders.push(folderObject)
                }
                
            }
            
            var resultObject = {
                baseFolder : normalizedPath,
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
    listFolder : listFolder,
    isRootSync : isRootSync,
}

// var writeToConsole = param => console.log(param)
// let p = listFolder('D:\\Archive')
// if(p instanceof Promise) {
//     p.then(writeToConsole)
// }

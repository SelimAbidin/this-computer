# this-computer
Including volumes, directory listing library

# ATTENTION, this is alpha release. Not tested yet

```js
import {volumes, listFolder} from 'this-computer'

// returns JavaScript Promise
let volumes = await volumes()

// output
{
 baseFolder : "This Computer",
 subFiles : [
                { name : "C:", path : "C:" },
                { name : "D:", path : "D:" }
            ]
}

// returns JavaScript Promise as well
let path = "C:\\myFolder\\mySubFolder"
listFolder(path).then( (data) => {

    console.log(data)
    // Output
    {
    baseFolder : "C:\\myFolder\\mySubFolder",
    subFiles : [
                    { name : "..", path : "C:\\myFolder\\" },
                    { name : "file1.js", path : "C:\\myFolder\\mySubFolder\file1.js" },
                    { name : "file2.js", path : "C:\\myFolder\\mySubFolder\file2.js" }
                ]
    }
})

```

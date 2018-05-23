const _path = require('path');
const _fs = require('./fs-promised');

// list files and directories of a given directory
async function scandir(dir, recursive=true, absolutePaths=false){
    // get absolute path
    const absPath = _path.resolve(dir);

    // stats command executable ? dir/file exists
    const stats = await _fs.stat(absPath);

    // check if its a directory
    if (!stats.isDirectory()){
        throw new Error('Requested directory <' + absPath  + '> is not of type directory');
    }

    // use absolute paths ?
    if (absolutePaths){
        dir = absPath;
    }

    // stack of directories to scan
    const dirstack = [dir];

    // list of files
    const files = [];

    // list of directories
    const directories = [];

    // iterative scan files
    while (dirstack.length > 0){
        // get current directory
        const currentDir = dirstack.pop();

        // get current dir items
        const itemNames = await _fs.readdir(currentDir);

        // get item stats (parallel)
        const itemStats = await Promise.all(itemNames.map((item) => _fs.stat(_path.join(currentDir, item))));

        // process item stats
        for (let i=0;i<itemNames.length;i++){
            // prepend current path
            const currentItem = _path.join(currentDir, itemNames[i]);

            // directory ? push to stack and directory list
            if (itemStats[i].isDirectory()){
                // recursive mode ?
                if (recursive){
                    dirstack.push(currentItem);
                }
                
                // store dir entry
                directories.push(currentItem);

            // file, socket, symlink, device..
            }else{
                // push to filelist
                files.push(currentItem);
            }
        }
    }

    // return file and directory list
    return [files, directories];
}

module.exports = scandir;
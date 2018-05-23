const _path = require('path');
const _fs = require('./fs-promised');
const _statx = require('./statx');

// helper function to create directory only if they don't exists
async function mkdirp(dir, mode=0o777, recursive=false){
    
    // stats command executable ? dir/file exists
    const stats = await _statx(dir);

    // dir already exists ?
    if (stats){
        // check if its a directory
        if (!stats.isDirectory()){
            throw new Error('Requested directory <' + dir  + '> already exists and is not of type directory');
        }

        // check mode
        if (stats.mode !== mode){
            await _fs.chmod(dir, mode);
        }

    // create it recursivly
    }else if (recursive){
        // absolute or relative path ? make it absolute
        // split into components
        const dirComponents = _path.parse(_path.resolve(dir));

        // get root dir (posix + windows)
        const rootDir = dirComponents.root;

        // extract dir (without root)
        const dirRelativePath = _path.join(dirComponents.dir, dirComponents.base).substring(rootDir.length);

        // split into parts
        const subdirs = dirRelativePath.split(_path.sep);

        // minimum of 1 segement required - this function does not create directories within filesystem root
        if (subdirs.length < 2){
            throw new Error('Recursive mkdir does not create directories within filesystem root!');
        }

        // build initial directory
        let dyndir = _path.join(rootDir, subdirs.shift());

        // iterate over path
        while (subdirs.length > 0){

            // append part
            dyndir = _path.join(dyndir, subdirs.shift());

            // stats command executable ? dir/file exists
            const cstats = await _statx(dyndir);

            // dir already exists ?
            if (cstats){
                // check if its a directory
                if (!cstats.isDirectory()){
                    throw new Error('Requested path <' + dyndir  + '> already exists and not of type directory');
                }
            
            // create directory
            }else{
                await _fs.mkdir(dyndir, mode);
            }
        }

    // just create top level
    }else{
        await _fs.mkdir(dir, mode);
    }
}

module.exports = mkdirp;
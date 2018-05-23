const _path = require('path');
const _fs = require('./fs-promised');

// remove directory recursivly (all items within)
async function rmrf(dir){
    // get absolute path
    const absPath = _path.resolve(dir);

    let stats = null;
    // stats command executable ? dir/file exists
    try{
        stats = await _fs.stat(absPath);

    }catch(e){
        throw new Error('Requested directory <' + absPath  + '> does not exists or is not accessible');
    }

    // split path into components
    const dirComponents = _path.parse(absPath);

    // get root dir (posix + windows)
    const rootDir = dirComponents.root;

    // extract dir (without root)
    const dirRelativePath = _path.join(dirComponents.dir, dirComponents.base).substring(rootDir.length);

    // split into parts
    const subdirs = dirRelativePath.split(_path.sep);

    // minimum of 1 segement required - this function does not remove directories within filesystem root
    if (subdirs.length < 2){
        throw Error('Recursive rm does not remove directories within filesystem root! This is a security consideration!');
    }
    
    // check if its a directory
    if (!stats.isDirectory()){
        // just remove the item
        await _fs.unlink(absPath);
        return;
    }

    // get all items of given directory
    const [files, dirs] = await _fs.scandir(absPath, true, true);

    // delete all files
    // @TODO this can be done in parallel with Promise.all but should limited
    // to a maximum amount of calls (limited file handles!)
    for (let i=0;i<files.length;i++){
        await _fs.unlink(files[i]);
    }

    // sort directories descending (deepest dirs first)
    dirs.sort().reverse();

    // delete all dirs
    for (let i=0;i<dirs.length;i++){
        await _fs.rmdir(dirs[i]);
    }

    // finally delete base dir
    await _fs.rmdir(absPath);
}

module.exports = rmrf;
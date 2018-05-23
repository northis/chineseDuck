const _fs = require('./fs-promised');

// check if node is a symlink
async function isSymlink(filename){
    try{
        // get stats
        const stats = await _fs.lstat(filename);

        // is symlink ?
        return stats.isSymbolicLink();
    }catch(e){
        // file not found error ?
        if (e.code === 'ENOENT'){
            return false;
        }else{
            throw e;
        }
    }
}

module.exports = isSymlink;
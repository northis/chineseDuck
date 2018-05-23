const _fs = require('./fs-promised');

// check if node is of specific type
async function isFileOfType(filename, condition){
    try{
        // get stats
        const stats = await _fs.stat(filename);

        // is directory ?
        return condition(stats);
    }catch(e){
        // file not found error ?
        if (e.code === 'ENOENT'){
            return false;
        }else{
            throw e;
        }
    }
}

module.exports = isFileOfType;
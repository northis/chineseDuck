const _oftype = require('./isFileOfType');

// ignore file not found errors
function statx(filename){
    // passthrough the stat object, FALSE in case of ENOENT error
    return _oftype(filename, (stats) => stats);
}

module.exports = statx;
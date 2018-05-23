const _oftype = require('./isFileOfType');

// check if node is directory
function isDirectory(filename){
    return _oftype(filename, (stats) => stats.isDirectory());
}

module.exports = isDirectory;
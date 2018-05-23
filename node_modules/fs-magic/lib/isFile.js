const _oftype = require('./isFileOfType');

// check if node is file
function isFile(filename){
    return _oftype(filename, (stats) => stats.isFile());
}

module.exports = isFile;
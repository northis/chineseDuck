const _oftype = require('./isFileOfType');

// check if node is socket
function isSocket(filename){
    return _oftype(filename, (stats) => stats.isSocket());
}

module.exports = isSocket;
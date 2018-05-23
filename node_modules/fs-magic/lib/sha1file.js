const _checksum = require('./checksum');

function sha1file(filename, outputFormat='hex'){
    // generate hash
    return _checksum(filename, 'sha1', outputFormat);
}

module.exports = sha1file;
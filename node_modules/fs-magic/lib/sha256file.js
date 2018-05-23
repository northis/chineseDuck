const _checksum = require('./checksum');

function sha256file(filename, outputFormat='hex'){
    // generate hash
    return _checksum(filename, 'sha256', outputFormat);
}

module.exports = sha256file;
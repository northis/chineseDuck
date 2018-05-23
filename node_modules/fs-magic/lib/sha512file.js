const _checksum = require('./checksum');

function sha512file(filename, outputFormat='hex'){
    // generate hash
    return _checksum(filename, 'sha512', outputFormat);
}

module.exports = sha512file;
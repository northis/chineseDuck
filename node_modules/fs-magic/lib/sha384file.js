const _checksum = require('./checksum');

function sha384file(filename, outputFormat='hex'){
    // generate hash
    return _checksum(filename, 'sha384', outputFormat);
}

module.exports = sha384file;
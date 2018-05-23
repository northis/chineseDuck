const _checksum = require('./checksum');

function md5file(filename, outputFormat='hex'){
    // generate hash
    return _checksum(filename, 'md5', outputFormat);
}

module.exports = md5file;
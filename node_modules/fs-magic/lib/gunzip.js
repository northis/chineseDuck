const _zlib = require('zlib');
const _fileOutputStream = require('./FileOutputStream');
const _fileInputStream = require('./FileInputStream');

// decompress a file
async function gunzip(input, dst){
    // is input a filename or stream ?
    if (typeof input === 'string'){
        input = await _fileInputStream(input);
    }

    // decompress
    const gzipStream = input.pipe(_zlib.createGunzip());

    // write content to file
    return _fileOutputStream(gzipStream, dst);
}

module.exports = gunzip;
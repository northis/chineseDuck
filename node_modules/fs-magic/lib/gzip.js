const _zlib = require('zlib');
const _fileOutputStream = require('./FileOutputStream');
const _fileInputStream = require('./FileInputStream');

// compress a file
async function gzip(input, dst, level=4){
    // is input a filename or stream ?
    if (typeof input === 'string'){
        input = await _fileInputStream(input);
    }

    // compress
    const gzipStream = input.pipe(_zlib.createGzip({
        level: level
    }));

    // write content to file
    return _fileOutputStream(gzipStream, dst);
}

module.exports = gzip;
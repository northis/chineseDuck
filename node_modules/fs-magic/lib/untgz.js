const _zlib = require('zlib');
const _untar = require('./untar');

// decompress a tar.gz archive
function untgz(istream, dst){
    // decompress
    const tarStream = istream.pipe(_zlib.createGunzip());

    // unpack
    return _untar(tarStream, dst);
}

module.exports = untgz;
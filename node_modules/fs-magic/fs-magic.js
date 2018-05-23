// basic, promisified functions
let _fs = require('./lib/fs-promised');

// addons
_fs.exists = require('./lib/exists');
_fs.copy = require('./lib/copy');
_fs.bulkCopy = require('./lib/bulkCopy');
_fs.scandir = require('./lib/scandir');
_fs.mkdirp = require('./lib/mkdirp');
_fs.rmrf = require('./lib/rmrf');
_fs.FileInputStream = require('./lib/FileInputStream');
_fs.FileOutputStream = require('./lib/FileOutputStream');
_fs.isDirectory = require('./lib/isDirectory');
_fs.isFile = require('./lib/isFile');
_fs.isSocket = require('./lib/isSocket');
_fs.isSymlink = require('./lib/isSymlink');
_fs.isFileOfType = require('./lib/isFileOfType');
_fs.untar = require('./lib/untar');
_fs.untgz = require('./lib/untgz');
_fs.gzip = require('./lib/gzip');
_fs.gunzip = require('./lib/gunzip');
_fs.checksum = require('./lib/checksum');
_fs.md5file = require('./lib/md5file');
_fs.sha1file = require('./lib/sha1file');
_fs.sha256file = require('./lib/sha256file');
_fs.sha384file = require('./lib/sha384file');
_fs.sha512file = require('./lib/sha512file');
_fs.statx = require('./lib/statx');

module.exports = _fs;
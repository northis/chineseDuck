const _fOutoutStream = require('./FileOutputStream');
const _fInputStream = require('./FileInputStream');

// copy source file to destination (override it)
async function copy(src, dst, mode=null){
    // open file input stream
    const istream = await _fInputStream(src);

    // write stream content to file
    return _fOutoutStream(istream, dst, mode);
}

module.exports = copy;


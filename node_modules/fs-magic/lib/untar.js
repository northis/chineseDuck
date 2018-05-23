const _path = require('path');
const _tar = require('tar-stream');
const _mkdirp = require('./mkdirp');
const _isDirectory = require('./isDirectory');
const _fileOutputStream = require('./FileOutputStream');

// decompress an archive
async function untar(istream, dst){
    // is destination a directory ?
    if (!await _isDirectory(dst)){
        throw Error('Destination is not a valid directory: ' + dst);
    }

    // get instance
    const extract = _tar.extract();

    // list of extracted files
    const items = [];
    
    // wrap into Promise
    return new Promise(function(resolve, reject){

        // process each tar entry!
        extract.on('entry', async function(header, fstream, next){

            // add item to list
            items.push(header.name);

            // directory entry ?
            if (header.type == 'directory'){
                // create subdirectory
                await _mkdirp(_path.join(dst, header.name), header.mode, true);

            // file entry ?
            }else if (header.type == 'file'){
                // redirect content to file
                await _fileOutputStream(fstream, _path.join(dst, header.name), header.mode);
            }

            // next entry
            next();
        });
        
        // listener
        extract.on('finish', function(){
            resolve(items);
        });
        extract.on('error', reject);

        // pipe through extractor
        istream.pipe(extract);
    });
}

module.exports = untar;
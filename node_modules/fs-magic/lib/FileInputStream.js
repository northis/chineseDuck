const _fs = require('fs');

// open read stream
function FileInputStream(src){
    // wrap into Promise
    return new Promise(function(resolve, reject){

         // open read stream
        const istream = _fs.createReadStream(src);
        istream.on('error', reject);
        istream.on('open', function(){
            resolve(istream);
        });
    });
}

module.exports = FileInputStream;
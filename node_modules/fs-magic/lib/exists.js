const _fs = require('fs');

// "modern" exists implmentation
function exists(filedir){
    // promise wrapper
    return new Promise(function(resolve){
        // try to stat the file
        _fs.stat(filedir, function(err){
            resolve(!err)
        });
    });
}

module.exports = exists;
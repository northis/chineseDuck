const _fs = require('fs');

// write a stream to destination file
function FileOutputStream(istream, destinationFilename, mode=false){
    // wrap into Promise
    return new Promise(function(resolve, reject){

        // file output stream
        let ostream = null;

        // on complete - chmod
        const onComplete = function(){
            // file mode defined ?
            if (mode){
                // set mode of destination file
                _fs.chmod(destinationFilename, mode, function(err){
                    if (err){
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            }else{
                // finish
                resolve();
            }
        }

        // cleanup
        const onError = function(e){
            // detach finish listener!
            if (ostream){
                ostream.removeListener('finish', onComplete);
            }
            
            // close streams
            if (istream){
                istream.destroy();
            }
            if (ostream){
                ostream.end();
            }

            // throw error
            reject(e);
        }

        // add additional error listener to input stream
        istream.on('error', onError);

        // open write stream
        ostream = _fs.createWriteStream(destinationFilename);
        ostream.on('error', onError);
        ostream.on('finish', onComplete);

        // pipe in to out
        istream.pipe(ostream);
    });
}

module.exports = FileOutputStream;
const _fInputStream = require('./FileInputStream');
const _crypto = require('crypto');

// generic checksum hashing
function checksum(src, algorithm='sha256', outputFormat='hex'){
    return new Promise(async function(resolve, reject){
        // hash engine
        const hash = _crypto.createHash(algorithm);

        // events
        hash.on('readable', function(){
            // get hashsum
            const sum = hash.read();

            // data available ?
            if (!sum){
                return;
            }

            // hex, base64 or buffer
            switch (outputFormat){
                case 'base64':
                    resolve(sum.toString('base64'));
                    break;
                case 'raw':
                case 'buffer':
                    resolve(sum);
                    break;
                default:
                    resolve(sum.toString('hex'));
                    break;
            }
        });
        hash.on('error', function(e){
            reject(e);
        })

        try{
            // open file input stream
            const input = await _fInputStream(src);

             // stream hashing
            input.pipe(hash);
        }catch(e){
            reject(e);
        }
    });
}

module.exports = checksum;
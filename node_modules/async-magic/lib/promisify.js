// create a wrapper with dynamic function name
// required to get real function names within stack-trace
function dynamicNamedPromisifiedFunction(fn, name=null){
    if (typeof fn !== 'function'){
        throw new Error('Input is not of type function - promisification failed');
    } 

    // set function name
    const fname = name || fn.name || 'anonymous';

    // temporary object. assign function name as symbol
    const T = {
        // use rest parameter expansion
        [fname](...args){
            // promise wrapper
            return new Promise(function(resolve, reject){
                // call function with given args.
                // add callback as last arg (promise resolver)
                fn(...args, function(err, ...cbargs){
                    // resolve promise
                    if (err){
                        reject(err);
                    }else{
                        // multiple return values ?
                        if (cbargs.length === 1){
                            resolve(...cbargs)
                        // to array
                        }else{
                            resolve([...cbargs]);
                        }
                    }
                });
            });
        }
    };

    // select named function
    return T[fname];
}

module.exports = dynamicNamedPromisifiedFunction;
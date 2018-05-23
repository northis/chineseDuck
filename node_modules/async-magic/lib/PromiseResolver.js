// wrap promised function including args
// promise is not executed yet!
function PromiseResolver(fn, ...args){

    // just return a wrapped resolver function
    return {
        resolve: function(){
            return fn(...args);
        }
    };
}

module.exports = PromiseResolver;
// a promised based sleep function
function sleep(time=1){
    return new Promise(function(resolve){
        setTimeout(resolve, time);
    });
}

module.exports = sleep;
// wait for all promises has been resolved
// just an Promise.all alias
function wait(promises){
    return Promise.all(promises);
}

module.exports = wait;
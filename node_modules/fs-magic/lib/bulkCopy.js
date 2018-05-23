const _mkdirp = require('./mkdirp');
const _copy = require('./copy');
const _path = require('path');
const _async = require('async-magic');

// copy a set of files simultanous
async function bulkCopy(srcset, createDestinationDirs=true, defaultFilemode=0o750, defaultDirmode=0o777){
    // create destination directories in advance ?
    if (createDestinationDirs === true){
        // get unique paths from filelist
        const dstDirs = Array.from(new Set(srcset.map((set) => _path.dirname(set[1]))));

        // create dirs
        for (let i=0;i<dstDirs.length;i++){
            await _mkdirp(dstDirs[i], defaultDirmode, true);
        }
    }

    // create tasks
    const tasks = srcset.map((set) => _async.PromiseResolver(_copy, set[0], set[1], set[2] || defaultFilemode));

    // resolve tasks in parallel with task limit 100
    await _async.parallel(tasks, 100);
}

module.exports = bulkCopy;
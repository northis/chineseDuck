[![Build Status](https://travis-ci.org/AndiDittrich/Node.fs-magic.svg?branch=master)](https://travis-ci.org/AndiDittrich/Node.fs-magic)

fs-magic
=========================

An extended, promisified **fs** drop-in-replacement for Node.js **>=7.6**

Features
------------------------------

* All asynchronous **fs** functions are and converted into promises with **async-magic**
* Lot of extended functions are added
* Designed to run with the pure power of native `Promise`, `await` and `async function`
* No backward compatibility layer
* OS Support for POSIX and Win Platforms (as of v1.3.0)
* Streams, Streams, Streams - all file operations are stream-based!

Addons
------------------------------

* **copy** Just copy a file (stream based)
* **bulkCopy** Copy multiple files/directories in once
* **mkdirp** Create directories recursivly
* **scandir** List all files + directories of given directory recursivly
* **rmrf** Removes all files of a given directory recursivly
* **exists** Custom `exists` function to test file existence
* **isFile** Check if item is a file
* **isDirectory** Check if item is a directory
* **isSymlink** Check if item is a symlink
* **isSocket** Check if item is a socket
* **isFileOfType** Check if item is of specific type
* **FileInputStream** Open a new fileReadStream
* **FileOutputStream** Write stream to destination file
* **untar** Extracting `.tar` archives using **tar-stream**
* **untgz** Extracting gzip compressed `.tar` archives
* **gzip** Compress a file
* **gunzip** Decompress a file
* **sha1file** SHA1 File Checksum
* **sha256file** SHA256 File Checksum
* **sha384file** SHA384 File Checksum
* **sha512file** SHA512 File Checksum
* **md5file** MD5 File Checksum
* **checksum** Generic File Checksum
* **statx** Silent stat (returns false in case of ENOENT)

Promisified FS API
------------------------------

The following asynchronous `fs` methods are promisified and exposed within the `fs-magic` object. All synchronous functions are ignored because there is no need for them anymore - use `await`!

* **access**
* **appendFile**
* **chmod**
* **chown**
* **close**
* **fchmod**
* **fchown**
* **fdatasync**
* **fstat**
* **fsync**
* **ftruncate**
* **futimes**
* **lchown**
* **link**
* **lstat**
* **mkdir**
* **mkdtemp**
* **open**
* **read**
* **readFile**
* **readdir**
* **readlink**
* **realpath**
* **rename**
* **rmdir**
* **stat**
* **symlink**
* **truncate**
* **unlink**
* **utimes**
* **write**
* **writeFile**

General Usage
------------------------------

```js
const _fsm = require('fs-magic');

// wraper 
(async function(){
    // get stats
    const stats= await _fsm.fstat('myfile.js');

    // does the file exists ?
    console.log(await _fsm.exists('myfile.js'));

    // copy a file, set chmod to 0640
    await _fsm.copy('test1.js', 'test2.js', 0o640);

    // create directory stucture at once
    await _fsm.mkdirp('my/custom/dir/1/2/3', 0o777, true);

    // use fs methods
    await _fsm.rmdir('mydir');
})();
```

fs-magic::copy
---------------------------------

**Description:** Copy a single file

**Syntax:** `copy(sourcefile:string, destinationfile:string, mode:int=null)`

**Example:**

```js
// copy a file, set chmod to 0640
await _fsm.copy('test1.js', 'test2.js', 0o640);
```


fs-magic::bulkCopy
---------------------------------

**Description:** Copy multiple files at once

**Syntax:** `bulkCopy(srcset:Array, createDestinationDirs:boolean=true, defaultFilemode:int=0o750, defaultDirmode:int=0o777)`

**Example:**

```js
// list of files to copy
const srcset = [
    ['source/file1.js', 'destination/subdir/file1.js', 0o644],
    ['source/file2.js', 'destination/subdir/file2.js', 0o644],
    ['source/file3.js', 'destination/subdir/x/file3.js', 0o644],
    ['source/file4.js', 'destination/subdir/x/file4.js', 0o644],
];

// copy files + create destination directories
await _fsm.bulkCopy(srcset, true);

```

fs-magic::mkdirp
---------------------------------

**Description:** Create a directories recusivly

**Syntax:** `mkdirp(directory:string, mode:int=0o777, recursive:boolean=false)`

**Example:**

```js
// create directory stucture at once
await _fsm.mkdirp('my/custom/dir/1/2/3', 0o777, true);
```

fs-magic::scandir
---------------------------------

**Description:** List all files + directories of given directory recursivly (optional)

**Syntax:** `scandir(directory:string, recursive:boolean=true, absolutePaths:boolean=false)`

**Example:**

```js
// get file + directory list of all files. Use absolute output paths
const [files, dirs] = await _fs.scandir('project/modules', true, true);
```

fs-magic::rmrf
---------------------------------

**Description:** Removes all files of a given directory recursivly

**Syntax:** `rmrf(directory:string)`

**Note:** For security reasons, this function **does not** accept the file system root `/` or a directory within it like `/etc` as input 

**Example:**

```js
// remove a project folder
await _fs.rmrf('projects/js1');
```

fs-magic::exists
---------------------------------

**Description:** Check if a file/directory/link exists

**Syntax:** `exists(filedir:string)`

**Example:**

```js
// does the file exists ?
console.log(await _fsm.exists('myfile.js'));
```

fs-magic::isFile
---------------------------------

**Description:** Check if a item is of type file

**Syntax:** `isFile(filesystemItem:string)`

**Example:**

```js
// is a file ?
console.log(await _fsm.isFile('myfile.js'));
```

fs-magic::isDirectory
---------------------------------

**Description:** Check if a item is of type directory

**Syntax:** `isDirectory(filesystemItem:string)`

**Example:**

```js
// is a directory ?
console.log(await _fsm.isDirectory('/var/log'));
```

fs-magic::isSocket
---------------------------------

**Description:** Check if a item is of type socket

**Syntax:** `isSocket(filesystemItem:string)`

**Example:**

```js
// is a socket ?
console.log(await _fsm.isSocket('/var/run/phpfpm.sock'));
```

fs-magic::isSymlink
---------------------------------

**Description:** Check if a item is of type symlink

**Syntax:** `isSymlink(filesystemItem:string)`

**Example:**

```js
// is a symlink ?
console.log(await _fsm.isSymlink('/etc/motd'));
```

fs-magic::isFileOfType
---------------------------------

**Description:** Check if a item is of specific type

**Syntax:** `isFileOfType(filename:string, condition:function)`

**Example:**

```js
// check if node is socket
async function isSocket(filename){
    return await _fsm.isFileOfType(filename, (stats) => stats.isSocket());
};
```

fs-magic::FileInputStream
---------------------------------

**Description:** Open a fileStream for read

**Syntax:** `FileInputStream(sourcefile:string)`

**Example:**

```js
const _fsm = require('fs-magic');

// copy source file to destination (override it)
async function copy(src, dst, mode=null){
    // open file input stream
    const istream = await _fsm.FileOutputStream(src);

    // write stream content to file
    return _fsm.FileOutputStream(istream, dst, mode);
}
```

fs-magic::FileOutputStream
---------------------------------

**Description:** Writes given stream into file

**Syntax:** `FileOutputStream(readstream:stream, destinationFilename:string, mode:int=false)`

**Example:**

```js
const _fsm = require('fs-magic');
const _fetch = require('node-fetch');

// fetch remote content
const response = await _fetch('http://example.org/file.gz');

// write stream content to file
await _fsm.FileOutputStream(response.body, dst, mode);
```

fs-magic::untar
---------------------------------

**Description:** Extracts contents of a `.tar` archive into given directory using **tar-stream**

**Syntax:** `untar(inputstream:stream, destinationDirectory:string)`

**Example:**

```js
const _fetch = require('node-fetch');
const _fsm = require('fs-magic');

// fetch remote content
const response = await _fetch('http://example.org/file.tar');

// unpack into currrent directory
let items = await _fsm.untar(response.body, '.');
```

fs-magic::untgz
---------------------------------

**Description:** Extracts contents of a gzip compressed `.tar.gz` archive into given directory using **tar-stream**

**Syntax:** `untgz(inputstream:stream, destinationDirectory:string)`

**Example:**

```js
const _fetch = require('node-fetch');

// fetch remote content
const response = await _fetch('http://example.org/file.tar.gz');

// unpack into currrent directory
let items = await _fsm.untgz(response.body, '.');
```

fs-magic::gzip
---------------------------------

**Description:** Compresses a file

**Syntax:** `gzip(input:{string, stream}, destinationFilename:string)`

**Example:**

```js
// compress a file
await _fsm.gzip('./file.txt', './file.gz');
```

fs-magic::gunzip
---------------------------------

**Description:** Decompresses a file

**Syntax:** `gunzip(input:{string, stream}, destinationFilename:string)`

**Example:**

```js
// decompress a file
await _fsm.gunzip('./file.gz', './my-file.txt');
```

```js
// fetch content
const response = await _fetch('http://example.org/file.gz');

// decompress a stream
await _fsm.gunzip(response.body, './file.txt');
```

fs-magic::checksum
---------------------------------

**Description:** Generic File Checksum

**Syntax:** `checksum(filename:string, algorithm:string='sha256', outputFormat:string='hex')`

**Example:**

```js
// sha384 checksum as base64
const sum = await _fsm.checksum('./file.txt', 'sha384', 'base64');
```

fs-magic::sha1file
---------------------------------

**Description:** SHA1 File Checksum

**Syntax:** `sha1file(filename:string, outputFormat:string='hex')`

**Example:**

```js
// sha1 checksum as hex
const sum = await _fsm.sha1file('./file.txt');
```

fs-magic::sha256file
---------------------------------

**Description:** SHA256 File Checksum

**Syntax:** `sha256file(filename:string, outputFormat:string='hex')`

**Example:**

```js
// sha256 checksum as hex
const sum = await _fsm.sha256file('./file.txt');
```

fs-magic::sha384file
---------------------------------

**Description:** SHA384 File Checksum

**Syntax:** `sha384file(filename:string, outputFormat:string='hex')`

**Example:**

```js
// sha384 checksum as buffer
const sum = await _fsm.sha384file('./file.txt', 'raw');
```

fs-magic::sha512file
---------------------------------

**Description:** SHA512 File Checksum

**Syntax:** `sha512file(filename:string, outputFormat:string='hex')`

**Example:**

```js
// sha512 checksum as base64
const sum = await _fsm.sha512file('./file.txt', 'base64');
```

fs-magic::statx
---------------------------------

**Description:** Extended `stat` function. The function retuns **false** in case of ENOENT error (file not found)

**Syntax:** `statx(filesystemItem:string)`

**Example:**

```js
// get file stats ?
const stats = await _fsm.statx('/var/log/unknown_file.log');

if (stats !== false){
    console.log(stats);
}
```

Any Questions ? Report a Bug ? Enhancements ?
---------------------------------------------
Please open a new issue on [GitHub](https://github.com/AndiDittrich/Node.fs-magic/issues)

License
-------
fs-magic is OpenSource and licensed under the Terms of [The MIT License](LICENSE.md)
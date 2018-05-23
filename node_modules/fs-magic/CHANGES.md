### 2.1.1 ###
* Bugfix: Fixed `stat` key testcases (node v8 compatibilty)
* Bugfix: `fs.createReadStream` was overwritten by `createWriteStream` (typo)
* Bugfix: `fs.createWriteStream` was not exposed

### 2.1.0 ###
* Added: mocha based testcases
* Added travisci integration
* Added: ESlint check based on `eslint:recommended` and `eslint-config-aenondynamics`
* Bugfix: Function `isSymlink` thrown an exception in case the file/node don't exists / see #1

### 2.0.3 ###
* Bugfix: Wrong version of async-magic within package.json

### 2.0.2 ###
* Added: Limited the number of parallel copy tasks (100) of `bulkCopy`
* Bugfix: Uninitialized variable within `FileInputStream` caused invalid file handle on parallel operation

### 2.0.1 ###
* Bugfix: Function like `isDirectory` thrown an exception in case the file/node don't exists - thanks to [lingmm on GitHub](https://github.com/AndiDittrich/Node.fs-magic/issues/1) #1

### 2.0.0 ###
* Replaced: **thenify-all** with **async-magic**

### 1.6.0 ###
* Added: File Checksum functions `md5file`, `sha1file`, `sha256file`, `sha512file`

### 1.5.0 ###
* Added: `gzip` function to compress a single file
* Added: `gunzip` function to decompress a single file

### 1.4.0 ###
* Added: `scandir` function to list all files+directories of a given directory (recursive)
* Added: `rmrf` function to recursive remove directories/files

### 1.3.1 ###
* Bugfix: `bulkCopy` failed because of missing `path` dependency

### 1.3.0 ###
* Added: Windows support

### 1.2.0 ###
* Added: `untar`, `untgz` functions to extract files from **tarballs**

### 1.1.0 ###
* Added: `isFile`, `isDirectory`, `isSocket`, `isSymlink` shortcuts

### 1.0.0 ###
Initial Public Release

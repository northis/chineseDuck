### 1.3.0 ###
* Added: ESlint check based on `eslint:recommended` and `eslint-config-aenondynamics`
* Added: `sleep` testcase
* Changed: Included ESlint in CI Tests
* Fixed: Some varirable declarations (lint warnings)

### 1.2.1 ###
* Changed: Doc Structure

### 1.2.0 ###
* Added: `.wait` function as alias of [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
* Added: `.PromiseResolver` to queue a promised function with given arguments for execution
* Added: `.parallel` function to execute multiple `PromiseResolver` in parallel with given task limit
* Added: `.series` function to execute multiple `PromiseResolver` in series
* Added: `.sleep` function to intercept the current function execution by n miliseconds asynchronous

### 1.1.0 ###
* Added: Mocha based Testcases

### 1.0.0 ###
Initial Public Release

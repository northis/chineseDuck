// exposed api functions
let _api = {};

// assign methods
_api.promisify = require('./lib/promisify');
_api.promisifyAll = require('./lib/promisify-all');
_api.wait = require('./lib/wait');
_api.PromiseResolver = require('./lib/PromiseResolver');
_api.parallel = require('./lib/parallel');
_api.series = require('./lib/series');
_api.sleep = require('./lib/sleep');

module.exports = _api;
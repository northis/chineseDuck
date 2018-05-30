'use strict';
var Swagmock = require('swagmock');
var swaggerDocument = require('../swagger.json');
var mockgen;

module.exports = function () {
    /**
     * Cached mock generator
     */
    mockgen = mockgen || Swagmock(swaggerDocument);
    return mockgen;
};

'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /word/{wordId}/score
 */
module.exports = {
    /**
     * summary: Update user&#39;s score for word
     * description: 
     * parameters: body, wordId
     * produces: 
     * responses: 200, 201, 400, 404
     * operationId: scoreWord
     */
    put: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/score',
                operation: 'put',
                response: '200'
            }, callback);
        },
        201: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/score',
                operation: 'put',
                response: '201'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/score',
                operation: 'put',
                response: '400'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/score',
                operation: 'put',
                response: '404'
            }, callback);
        }
    }
};

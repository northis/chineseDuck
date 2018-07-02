'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /word
 */
module.exports = {
    /**
     * summary: Add a new word to the store
     * description: 
     * parameters: word
     * produces: 
     * responses: 200, 409
     * operationId: addWord
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word',
                operation: 'post',
                response: '200'
            }, callback);
        },
        409: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word',
                operation: 'post',
                response: '409'
            }, callback);
        }
    },
    /**
     * summary: Update an existing word
     * description: 
     * parameters: body
     * produces: 
     * responses: 400, 404, 405
     * operationId: updateWord
     */
    put: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word',
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
                path: '/word',
                operation: 'put',
                response: '404'
            }, callback);
        },
        405: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word',
                operation: 'put',
                response: '405'
            }, callback);
        }
    }
};

'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /word/{wordId}
 */
module.exports = {
    /**
     * summary: 
     * description: Get word by id
     * parameters: wordId
     * produces: application/json
     * responses: 200, 400, 404
     * operationId: getWordId
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'get',
                response: '200'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'get',
                response: '400'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'get',
                response: '404'
            }, callback);
        }
    },
    /**
     * summary: Delete word
     * description: 
     * parameters: wordId
     * produces: 
     * responses: 400, 403, 404
     * operationId: deleteWord
     */
    delete: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'delete',
                response: '400'
            }, callback);
        },
        403: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'delete',
                response: '403'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}',
                operation: 'delete',
                response: '404'
            }, callback);
        }
    }
};

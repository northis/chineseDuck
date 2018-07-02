'use strict';
var Mockgen = require('../../../../mockgen.js');
/**
 * Operations on /word/user/{userId}/search/{wordEntry}
 */
module.exports = {
    /**
     * summary: Get words by word or character for user
     * description: Get words by wordEntry for user
     * parameters: wordEntry, userId
     * produces: 
     * responses: 200, 400, 404
     * operationId: getWordsByUser
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/user/{userId}/search/{wordEntry}',
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
                path: '/word/user/{userId}/search/{wordEntry}',
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
                path: '/word/user/{userId}/search/{wordEntry}',
                operation: 'get',
                response: '404'
            }, callback);
        }
    }
};

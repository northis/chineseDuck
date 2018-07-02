'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /folder/user/{userId}
 */
module.exports = {
    /**
     * summary: Get folders for user
     * description: 
     * parameters: userId
     * produces: application/json
     * responses: 400, 404, default
     * operationId: getFoldersForUser
     */
    get: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder/user/{userId}',
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
                path: '/folder/user/{userId}',
                operation: 'get',
                response: '404'
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder/user/{userId}',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};

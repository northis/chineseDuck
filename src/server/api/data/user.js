'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /user
 */
module.exports = {
    /**
     * summary: Create user
     * description: 
     * parameters: body
     * produces: application/json
     * responses: default
     * operationId: createUser
     */
    post: {
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user',
                operation: 'post',
                response: 'default'
            }, callback);
        }
    },
    /**
     * summary: Get user according to token in header
     * description: 
     * parameters: token
     * produces: application/json
     * responses: 200
     * operationId: getUserByToken
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};

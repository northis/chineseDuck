'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /user/login
 */
module.exports = {
    /**
     * summary: Logs user into the system
     * description: 
     * parameters: pnone, code
     * produces: application/json
     * responses: 200, 400, 404
     * operationId: loginUser
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/login',
                operation: 'post',
                response: '200'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/login',
                operation: 'post',
                response: '400'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/login',
                operation: 'post',
                response: '404'
            }, callback);
        }
    }
};

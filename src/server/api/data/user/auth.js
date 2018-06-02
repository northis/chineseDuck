'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /user/auth
 */
module.exports = {
    /**
     * summary: Send the auth code to user via sms
     * description: 
     * parameters: pnone
     * produces: application/json
     * responses: 200, 400, 404
     * operationId: authUser
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/auth',
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
                path: '/user/auth',
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
                path: '/user/auth',
                operation: 'post',
                response: '404'
            }, callback);
        }
    }
};

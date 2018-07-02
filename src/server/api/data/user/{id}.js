'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /user/{id}
 */
module.exports = {
    /**
     * summary: Get user by user id
     * description: 
     * parameters: id
     * produces: application/json
     * responses: 200, 404
     * operationId: getUserById
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/{id}',
                operation: 'get',
                response: '200'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/{id}',
                operation: 'get',
                response: '404'
            }, callback);
        }
    },
    /**
     * summary: Update user
     * description: This can only be done by the logged in user.
     * parameters: id, body
     * produces: application/json
     * responses: 400, 404
     * operationId: updateUser
     */
    put: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/{id}',
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
                path: '/user/{id}',
                operation: 'put',
                response: '404'
            }, callback);
        }
    },
    /**
     * summary: Delete user
     * description: This can only be done by the logged in user.
     * parameters: id
     * produces: application/json
     * responses: 400, 404
     * operationId: deleteUser
     */
    delete: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/{id}',
                operation: 'delete',
                response: '400'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/{id}',
                operation: 'delete',
                response: '404'
            }, callback);
        }
    }
};

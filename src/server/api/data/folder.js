'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /folder
 */
module.exports = {
    /**
     * summary: Create folder
     * description: 
     * parameters: body
     * produces: 
     * responses: 201, 409, default
     * operationId: createFolder
     */
    post: {
        201: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder',
                operation: 'post',
                response: '201'
            }, callback);
        },
        409: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder',
                operation: 'post',
                response: '409'
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder',
                operation: 'post',
                response: 'default'
            }, callback);
        }
    }
};

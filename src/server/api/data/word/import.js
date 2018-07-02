'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /word/import
 */
module.exports = {
    /**
     * summary: Imports new words to the store from a csv file
     * description: 
     * parameters: body
     * produces: 
     * responses: 200, 409, 413
     * operationId: importWord
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/import',
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
                path: '/word/import',
                operation: 'post',
                response: '409'
            }, callback);
        },
        413: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/import',
                operation: 'post',
                response: '413'
            }, callback);
        }
    }
};

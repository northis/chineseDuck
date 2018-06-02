'use strict';
var Mockgen = require('../../../mockgen.js');
/**
 * Operations on /word/{wordId}/file/{fileTypeId}
 */
module.exports = {
    /**
     * summary: Get word&#39;s flash card as png binary
     * description: 
     * parameters: wordId, fileTypeId
     * produces: 
     * responses: 200, 400, 404
     * operationId: getWordCard
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/file/{fileTypeId}',
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
                path: '/word/{wordId}/file/{fileTypeId}',
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
                path: '/word/{wordId}/file/{fileTypeId}',
                operation: 'get',
                response: '404'
            }, callback);
        }
    }
};

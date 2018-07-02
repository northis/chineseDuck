'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /folder/{folderId}
 */
module.exports = {
    /**
     * summary: Delete folder
     * description: 
     * parameters: folderId
     * produces: 
     * responses: 400, 404
     * operationId: deleteFolder
     */
    delete: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder/{folderId}',
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
                path: '/folder/{folderId}',
                operation: 'delete',
                response: '404'
            }, callback);
        }
    },
    /**
     * summary: Update folder (rename)
     * description: 
     * parameters: folderId, body
     * produces: 
     * responses: 400, 404, 409
     * operationId: updateFolder
     */
    put: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder/{folderId}',
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
                path: '/folder/{folderId}',
                operation: 'put',
                response: '404'
            }, callback);
        },
        409: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/folder/{folderId}',
                operation: 'put',
                response: '409'
            }, callback);
        }
    }
};

'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /word/folder/{folderId}
 */
module.exports = {
    /**
     * summary: Move words to another folder
     * description: 
     * parameters: wordIds, folderId
     * produces: 
     * responses: 400, 404
     * operationId: moveWordsToFolder
     */
    put: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/folder/{folderId}',
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
                path: '/word/folder/{folderId}',
                operation: 'put',
                response: '404'
            }, callback);
        }
    }
};

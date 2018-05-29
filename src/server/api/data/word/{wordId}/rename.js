'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /word/{wordId}/rename
 */
module.exports = {
    /**
     * summary: Rename words with another translation
     * description: 
     * parameters: newTranslation, wordId
     * produces: 
     * responses: 400, 404
     * operationId: renameWord
     */
    put: {
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/word/{wordId}/rename',
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
                path: '/word/{wordId}/rename',
                operation: 'put',
                response: '404'
            }, callback);
        }
    }
};

'use strict';
var dataProvider = require('../../../../data/word/{wordId}/file/{fileTypeId}.js');
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
     */
    get: function getWordCard(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

'use strict';
var dataProvider = require('../../data/word/{wordId}.js');
/**
 * Operations on /word/{wordId}
 */
module.exports = {
    /**
     * summary: 
     * description: Get word by id
     * parameters: wordId
     * produces: application/json
     * responses: 200, 400, 404
     */
    get: function getWordId(req, res, next) {
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
    },
    /**
     * summary: Delete word
     * description: 
     * parameters: wordId
     * produces: 
     * responses: 400, 403, 404
     */
    delete: function deleteWord(req, res, next) {
        /**
         * Get the data for response 400
         * For response `default` status 200 is used.
         */
        var status = 400;
        var provider = dataProvider['delete']['400'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

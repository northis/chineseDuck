'use strict';
var dataProvider = require('../data/word.js');
/**
 * Operations on /word
 */
module.exports = {
    /**
     * summary: Add a new word to the store
     * description: 
     * parameters: word
     * produces: 
     * responses: 200, 409
     */
    post: function addWord(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    /**
     * summary: Update an existing word
     * description: 
     * parameters: body
     * produces: 
     * responses: 400, 404, 405
     */
    put: function updateWord(req, res, next) {
        /**
         * Get the data for response 400
         * For response `default` status 200 is used.
         */
        var status = 400;
        var provider = dataProvider['put']['400'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

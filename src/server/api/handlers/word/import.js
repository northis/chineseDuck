'use strict';
var dataProvider = require('../../data/word/import.js');
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
     */
    post: function importWord(req, res, next) {
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
    }
};

'use strict';
var dataProvider = require('../../../../../data/word/user/{userId}/search/{wordEntry}.js');
/**
 * Operations on /word/user/{userId}/search/{wordEntry}
 */
module.exports = {
    /**
     * summary: Get words by word or character for user
     * description: Get words by wordEntry for user
     * parameters: wordEntry, userId
     * produces: 
     * responses: 200, 400, 404
     */
    get: function getWordsByUser(req, res, next) {
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

'use strict';
var dataProvider = require('../../../data/word/{wordId}/score.js');
/**
 * Operations on /word/{wordId}/score
 */
module.exports = {
    /**
     * summary: Update user&#39;s score for word
     * description: 
     * parameters: body, wordId
     * produces: 
     * responses: 200, 201, 400, 404
     */
    put: function scoreWord(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['put']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

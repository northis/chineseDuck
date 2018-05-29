'use strict';
var dataProvider = require('../../../data/word/{wordId}/rename.js');
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
     */
    put: function renameWord(req, res, next) {
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

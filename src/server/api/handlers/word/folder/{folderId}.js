'use strict';
var dataProvider = require('../../../data/word/folder/{folderId}.js');
/**
 * Operations on /word/folder/{folderId}
 */
module.exports = {
    /**
     * summary: Move words to another folder
     * description: 
     * parameters: body, folderId
     * produces: 
     * responses: 400, 404
     */
    put: function moveWordsToFolder(req, res, next) {
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

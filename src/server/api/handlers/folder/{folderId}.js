'use strict';
var dataProvider = require('../../data/folder/{folderId}.js');
/**
 * Operations on /folder/{folderId}
 */
module.exports = {
    /**
     * summary: Delete folder
     * description: 
     * parameters: folderId
     * produces: 
     * responses: 400, 404
     */
    delete: function deleteFolder(req, res, next) {
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
    },
    /**
     * summary: Update folder (rename)
     * description: 
     * parameters: folderId, body
     * produces: 
     * responses: 400, 404, 409
     */
    put: function updateFolder(req, res, next) {
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

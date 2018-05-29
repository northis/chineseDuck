'use strict';
var dataProvider = require('../../../data/folder/user/{userId}.js');
/**
 * Operations on /folder/user/{userId}
 */
module.exports = {
    /**
     * summary: Get folders for user
     * description: 
     * parameters: userId
     * produces: application/json
     * responses: 400, 404, default
     */
    get: function getFoldersForUser(req, res, next) {
        /**
         * Get the data for response 400
         * For response `default` status 200 is used.
         */
        var status = 400;
        var provider = dataProvider['get']['400'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

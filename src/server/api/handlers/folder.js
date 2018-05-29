'use strict';
var dataProvider = require('../data/folder.js');
/**
 * Operations on /folder
 */
module.exports = {
    /**
     * summary: Create folder
     * description: 
     * parameters: body
     * produces: 
     * responses: 201, 409, default
     */
    post: function createFolder(req, res, next) {
        /**
         * Get the data for response 201
         * For response `default` status 200 is used.
         */
        var status = 201;
        var provider = dataProvider['post']['201'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};

'use strict';
var dataProvider = require('../data/user.js');
/**
 * Operations on /user
 */
module.exports = {
    /**
     * summary: Create user
     * description: 
     * parameters: body
     * produces: application/json
     * responses: default
     */
    post: function createUser(req, res, next) {
        /**
         * Get the data for response default
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['default'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    /**
     * summary: Get user according to token in header
     * description: 
     * parameters: token
     * produces: application/json
     * responses: 200
     */
    get: function getUserByToken(req, res, next) {
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

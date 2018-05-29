'use strict';
var dataProvider = require('../../data/user/{id}.js');
/**
 * Operations on /user/{id}
 */
module.exports = {
    /**
     * summary: Get user by user id
     * description: 
     * parameters: id
     * produces: application/json
     * responses: 200, 404
     */
    get: function getUserById(req, res, next) {
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
    },
    /**
     * summary: Update user
     * description: This can only be done by the logged in user.
     * parameters: id, body
     * produces: application/json
     * responses: 400, 404
     */
    put: function updateUser(req, res, next) {
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
    },
    /**
     * summary: Delete user
     * description: This can only be done by the logged in user.
     * parameters: id
     * produces: application/json
     * responses: 400, 404
     */
    delete: function deleteUser(req, res, next) {
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
    }
};

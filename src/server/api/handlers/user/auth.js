'use strict';
var dataProvider = require('../../data/user/auth.js');
/**
 * Operations on /user/auth
 */
module.exports = {
    /**
     * summary: Send the auth code to user via sms
     * description: 
     * parameters: pnone
     * produces: application/json
     * responses: 200, 400, 404
     */
    get: function authUser(req, res, next) {
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

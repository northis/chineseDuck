'use strict';
var dataProvider = require('../../data/user/logout.js');
/**
 * Operations on /user/logout
 */
module.exports = {
    /**
     * summary: Erase the user token, so user have to recreate it next time
     * description: 
     * parameters: 
     * produces: application/json
     * responses: 200
     */
    get: function logoutUser(req, res, next) {
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

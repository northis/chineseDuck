'use strict';
var dataProvider = require('../../data/service/datetime.js');
/**
 * Operations on /service/datetime
 */
module.exports = {
    /**
     * summary: Get system datetime
     * description: 
     * parameters: 
     * produces: application/json
     * responses: 200
     */
    get: function getDatetime(req, res, next) {
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

'use strict';
var Mockgen = require('../mockgen.js');
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
     * operationId: getDatetime
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/service/datetime',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};

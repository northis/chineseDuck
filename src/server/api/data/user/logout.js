'use strict';
var Mockgen = require('../mockgen.js');
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
     * operationId: logoutUser
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/user/logout',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};

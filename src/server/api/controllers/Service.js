'use strict';

var utils = require('../utils/writer.js');
var Service = require('../service/ServiceService');

module.exports.getDatetime = function getDatetime (req, res, next) {
  Service.getDatetime()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

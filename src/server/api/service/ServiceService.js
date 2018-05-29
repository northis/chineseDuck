'use strict';


/**
 * Get system datetime
 *
 * returns Date
 **/
exports.getDatetime = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "2000-01-23T04:56:07.000+00:00";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


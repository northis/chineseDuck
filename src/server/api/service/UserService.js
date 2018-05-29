'use strict';


/**
 * Send the auth code to user via sms
 *
 * pnone String The user phone for auth
 * no response value expected for this operation
 **/
exports.authUser = function(pnone) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create user
 *
 * body User Created user object
 * no response value expected for this operation
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete user
 * This can only be done by the logged in user.
 *
 * id Long The user id that needs to be deleted.
 * no response value expected for this operation
 **/
exports.deleteUser = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get user by user id
 *
 * id Long The user id that needs to be fetched. Use 0 for testing.
 * returns User
 **/
exports.getUserById = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "mode" : "mode",
  "joinDate" : "2000-01-23T04:56:07.000+00:00",
  "lastCommand" : "lastCommand",
  "id" : 6,
  "tokenHash" : "tokenHash",
  "username" : "username"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get user according to token in header
 *
 * token String user token
 * returns User
 **/
exports.getUserByToken = function(token) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "mode" : "mode",
  "joinDate" : "2000-01-23T04:56:07.000+00:00",
  "lastCommand" : "lastCommand",
  "id" : 6,
  "tokenHash" : "tokenHash",
  "username" : "username"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs user into the system
 *
 * pnone String The user phone for auth
 * code String The auth code from sms
 * returns String
 **/
exports.loginUser = function(pnone,code) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Erase the user token, so user have to recreate it next time
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update user
 * This can only be done by the logged in user.
 *
 * id Long The user id that needs to be updated.
 * body User Updated user object
 * no response value expected for this operation
 **/
exports.updateUser = function(id,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


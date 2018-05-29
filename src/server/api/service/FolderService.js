'use strict';


/**
 * Create folder
 *
 * body Folder Created folder object
 * no response value expected for this operation
 **/
exports.createFolder = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete folder
 *
 * folderId Long The folder id that needs to be deleted.
 * no response value expected for this operation
 **/
exports.deleteFolder = function(folderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get folders for user
 *
 * userId Long User id
 * returns List
 **/
exports.getFoldersForUser = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "owner" : {
    "mode" : "mode",
    "joinDate" : "2000-01-23T04:56:07.000+00:00",
    "lastCommand" : "lastCommand",
    "id" : 6,
    "tokenHash" : "tokenHash",
    "username" : "username"
  },
  "owner_id" : 0,
  "name" : "name"
}, {
  "owner" : {
    "mode" : "mode",
    "joinDate" : "2000-01-23T04:56:07.000+00:00",
    "lastCommand" : "lastCommand",
    "id" : 6,
    "tokenHash" : "tokenHash",
    "username" : "username"
  },
  "owner_id" : 0,
  "name" : "name"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Move words to another folder
 *
 * wordIds List Word ids
 * folderId Long Folder id to move in
 * no response value expected for this operation
 **/
exports.moveWordsToFolder = function(wordIds,folderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update folder (rename)
 *
 * folderId Long The folder id that needs to be deleted.
 * body Folder folder with new name
 * no response value expected for this operation
 **/
exports.updateFolder = function(folderId,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


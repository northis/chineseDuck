'use strict';

var utils = require('../utils/writer.js');
var Folder = require('../service/FolderService');

module.exports.createFolder = function createFolder (req, res, next) {
  var body = req.swagger.params['body'].value;
  Folder.createFolder(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteFolder = function deleteFolder (req, res, next) {
  var folderId = req.swagger.params['folderId'].value;
  Folder.deleteFolder(folderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFoldersForUser = function getFoldersForUser (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  Folder.getFoldersForUser(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.moveWordsToFolder = function moveWordsToFolder (req, res, next) {
  var wordIds = req.swagger.params['wordIds'].value;
  var folderId = req.swagger.params['folderId'].value;
  Folder.moveWordsToFolder(wordIds,folderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateFolder = function updateFolder (req, res, next) {
  var folderId = req.swagger.params['folderId'].value;
  var body = req.swagger.params['body'].value;
  Folder.updateFolder(folderId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

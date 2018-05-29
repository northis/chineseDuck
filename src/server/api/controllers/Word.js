'use strict';

var utils = require('../utils/writer.js');
var Word = require('../service/WordService');

module.exports.addWord = function addWord (req, res, next) {
  var word = req.swagger.params['word'].value;
  Word.addWord(word)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteWord = function deleteWord (req, res, next) {
  var wordId = req.swagger.params['wordId'].value;
  Word.deleteWord(wordId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getWordId = function getWordId (req, res, next) {
  var wordId = req.swagger.params['wordId'].value;
  Word.getWordId(wordId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.importWord = function importWord (req, res, next) {
  var body = req.swagger.params['body'].value;
  Word.importWord(body)
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
  Word.moveWordsToFolder(wordIds,folderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.renameWord = function renameWord (req, res, next) {
  var newTranslation = req.swagger.params['newTranslation'].value;
  var wordId = req.swagger.params['wordId'].value;
  Word.renameWord(newTranslation,wordId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.scoreWord = function scoreWord (req, res, next) {
  var body = req.swagger.params['body'].value;
  var wordId = req.swagger.params['wordId'].value;
  Word.scoreWord(body,wordId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateWord = function updateWord (req, res, next) {
  var body = req.swagger.params['body'].value;
  Word.updateWord(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

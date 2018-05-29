'use strict';


/**
 * Add a new word to the store
 *
 * word Word Word object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.addWord = function(word) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete word
 *
 * wordId Long Word id to delete
 * no response value expected for this operation
 **/
exports.deleteWord = function(wordId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get word by id
 *
 * wordId Long Word id
 * returns Word
 **/
exports.getWordId = function(wordId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "score" : {
    "rightAnswerNumber" : 5,
    "pronunciationSuccessCount" : 7,
    "lastLearnMode" : "lastLearnMode",
    "originalWordSuccessCount" : 5,
    "originalWordCount" : 1,
    "translationCount" : 9,
    "isInLearnMode" : true,
    "name" : "name",
    "lastLearned" : "2000-01-23T04:56:07.000+00:00",
    "translationSuccessCount" : 3,
    "viewCount" : 2,
    "pronunciationCount" : 2,
    "lastView" : "lastView"
  },
  "pronunciation" : "zì|xíng|chē",
  "syllablesCount" : 3,
  "owner_id" : 6,
  "usage" : "我有自行车",
  "translation" : "велосипед",
  "id" : 0,
  "originalWord" : "自行车",
  "folder_id" : 4
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Imports new words to the store from a csv file
 *
 * body byte[] csv file
 * no response value expected for this operation
 **/
exports.importWord = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
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
 * Rename words with another translation
 *
 * newTranslation String New translation
 * wordId Long Word id to reaname
 * no response value expected for this operation
 **/
exports.renameWord = function(newTranslation,wordId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update user's score for word
 *
 * body Score Score object that needs to be updated in the word
 * wordId Long Word id to reaname
 * no response value expected for this operation
 **/
exports.scoreWord = function(body,wordId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing word
 *
 * body Word Word object that needs to be updated in the store
 * no response value expected for this operation
 **/
exports.updateWord = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


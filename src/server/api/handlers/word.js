import { mh } from "../../../server/api/db";
import { isNullOrUndefined } from "util";
import mongoose from "mongoose";
import * as errors from "../../errors";

/**
 * Operations on /word
 */
export const main = {
  /**
   * summary: Add a new word to the store
   * description:
   * parameters: word
   * produces:
   * responses: 200, 409
   */
  post: async function addWord(req, res, next) {
    try {
      const word = await mh.word.create(req.body);
      return res.status(200).send(word);
    } catch (error) {
      return errors.e409(res, "Word object already exists");
    }
  },
  /**
   * summary: Update an existing word
   * description:
   * parameters: body
   * produces:
   * responses: 400, 404, 405
   */
  put: async function updateWord(req, res, next) {
    try {
      const newWord = req.body;
      const newWordId = newWord._id;

      if (isNullOrUndefined(newWordId)) {
        return errors.e400(res, "Wrong id has been provided");
      }

      const updatedWord = {
        originalWord: newWord.originalWord,
        pronunciation: newWord.pronunciation,
        translation: newWord.translation,
        usage: newWord.usage,
        syllablesCount: newWord.syllablesCount,
        folder_id: newWord.folder_id,
        lastModified: Date.now()
      };

      if (!isNullOrUndefined(newWord.full)) updatedWord.full = newWord.full;
      if (!isNullOrUndefined(newWord.trans)) updatedWord.trans = newWord.trans;
      if (!isNullOrUndefined(newWord.pron)) updatedWord.pron = newWord.pron;
      if (!isNullOrUndefined(newWord.orig)) updatedWord.orig = newWord.orig;

      if (!isNullOrUndefined(newWord.score)) updatedWord.score = newWord.score;

      const wordDb = await mh.word.findOneAndUpdate(
        { _id: newWord._id },
        updatedWord,
        { new: true }
      );
      if (isNullOrUndefined(wordDb)) {
        return errors.e404(res, "We have not such word");
      }

      return res.status(200).send(wordDb);
    } catch (error) {
      return errors.e405(res, "Something goes wrong on word updating");
    }
  }
};
/**
 * Operations on /word/{wordId}
 */
export const wordId = {
  /**
   * summary:
   * description: Get word by id
   * parameters: wordId
   * produces: application/json
   * responses: 200, 400, 404
   */
  get: function getWordId(req, res, next) {
    res.status(404).send(404);
  },
  /**
   * summary: Delete word
   * description:
   * parameters: wordId
   * produces:
   * responses: 400, 403, 404
   */
  delete: function deleteWord(req, res, next) {
    res.status(404).send(404);
  }
};

/**
 * Operations on /word/import
 */
export const importWord = {
  /**
   * summary: Imports new words to the store from a csv file
   * description:
   * parameters: body
   * produces:
   * responses: 200, 409, 413
   */
  post: function importWord(req, res, next) {
    res.status(404).send(404);
  }
};

/**
 * Operations on /word/user/{userId}/search/{wordEntry}
 */
export const search = {
  /**
   * summary: Get words by word or character for user
   * description: Get words by wordEntry for user
   * parameters: wordEntry, userId
   * produces:
   * responses: 200, 400, 404
   */
  get: function getWordsByUser(req, res, next) {
    res.status(404).send(404);
  }
};

/**
 * Operations on /word/folder/{folderId}
 */
export const folderId = {
  /**
   * summary: Move words to another folder
   * description:
   * parameters: body, folderId
   * produces:
   * responses: 200, 400
   */
  put: async function moveWordsToFolder(req, res, next) {
    const idWordArray = req.body;
    const folderId = req.params.folderId;
    const idUser = req.session.passport.user;

    if (typeof idWordArray != "array")
      return res.status(400).send("Bad words id array");

    idWordArray.forEach(async id => {
      await mh.word.update(
        { _id: id, owner_id: idUser },
        { folder_id: folderId }
      );
    });
    res.status(200).send("Words have been moved");
  },

  /**
   * summary: Get words by folder id
   * description:
   * parameters: body, folderId
   * produces:
   * responses: 200
   */
  get: async function getWordsFolderId(req, res, next) {
    const idUser = req.session.passport.user;
    const folderId = req.params.folderId;

    const result = await mh.word
      .find(
        { owner_id: idUser, folder_id: folderId },
        { owner_id: false, folder_id: false }
      )
      .sort({ lastModified: -1 });

    res.json(result);
  }
};

/**
 * Operations on /word/{wordId}/score
 */
export const score = {
  /**
   * summary: Update user&#39;s score for word
   * description:
   * parameters: body, wordId
   * produces:
   * responses: 200, 201, 400, 404
   */
  put: function scoreWord(req, res, next) {
    res.status(404).send(404);
  }
};

/**
 * Operations on /word/{wordId}/rename
 */
export const rename = {
  /**
   * summary: Rename words with another translation
   * description:
   * parameters: newTranslation, wordId
   * produces:
   * responses: 400, 404
   */
  put: async function renameWord(req, res, next) {
    const wordId = req.params.wordId;
    const newTranslation = req.body.newTranslation;
    const idUser = req.session.passport.user;

    const word = await mh.word.updateOne(
      { _id: wordId, owner_id: idUser },
      { translation: newTranslation }
    );
    if (isNullOrUndefined(word))
      return res.status(404).send("Word is not found");
    res.json(word);
  }
};

/**
 * Operations on /word/file/{fileId}
 */
export const file = {
  /**
   * summary: Get word&#39;s flash card as png binary
   * description:
   * parameters: fileId
   * produces:
   * responses: 200, 400, 404
   */
  get: async function getWordCard(req, res, next) {
    const fileId = req.params.fileId;

    if (isNullOrUndefined(fileId) || !mongoose.Types.ObjectId.isValid(fileId))
      return res.status(400).send("Bad file Id");

    const result = await mh.wordFile.findById(fileId);

    if (isNullOrUndefined(result))
      return res.status(404).send("File not found");

    const file = result.bytes;

    var img = new Buffer(file.toString("binary"), "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length
    });
    res.end(img);
  }
};

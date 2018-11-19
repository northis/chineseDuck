import { mh } from "../../../server/api/db";
import * as models from "../../../server/api/db/models";
import { isNullOrUndefined } from "util";
import mongoose from "mongoose";
import * as errors from "../../errors";

const catchUniqueName = (res, error) => {
  if (error.code == 11000) errors.e409(res, "Word object already exists.");
  else errors.e500(res, error.message);
};

const updateWordCount = async folderId => {
  if (folderId !== 0) {
    const wordsCount = await mh.word.count({ folder_id: folderId });
    await mh.folder.updateOne({ _id: folderId }, { wordsCount: wordsCount });
  }
};

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

      await updateWordCount(word.folder_id);

      return res.status(200).send(word);
    } catch (error) {
      catchUniqueName(res, error);
    }
  },
  /**
   * summary: Update an existing word
   * description:
   * parameters: body
   * produces:
   * responses: 400, 404
   */
  put: async function updateWord(req, res, next) {
    try {
      const newWord = req.body;
      const newWordId = newWord._id;

      if (isNaN(newWordId)) {
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
      await updateWordCount(wordDb.folder_id);

      return res.status(200).send(wordDb);
    } catch (error) {
      catchUniqueName(res, error);
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
  get: async function getWordId(req, res, next) {
    const wordId = req.params.wordId;

    let wordDb = await mh.word.findOne({ _id: wordId });
    return res.status(200).send(wordDb);
  },
  /**
   * summary: Delete word
   * description:
   * parameters: wordId
   * produces:
   * responses: 400, 403, 404
   */
  delete: async function deleteWord(req, res, next) {
    const wordId = req.params.wordId;

    const word = await mh.word.findOne({ _id: wordId });
    let delRes = await mh.word.findByIdAndRemove({ _id: wordId });
    await updateWordCount(word.folder_id);

    return res.status(200).send(delRes);
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
  get: async function getWordsByUser(req, res, next) {
    const userId = req.params.userId;
    const wordEntry = req.params.wordEntry;

    let user = await mh.user.findOne({
      _id: userId
    });

    if (isNullOrUndefined(user)) return errors.e404(res, "User is not found");

    let words = await mh.word.find({
      originalWord: {
        $regex: wordEntry,
        $options: "i"
      },
      owner_id: userId,
      folder_id: user.currentFolder_id
    });
    res.json(words);
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

    if (!Array.isArray(idWordArray))
      return errors.e400(res, "Bad words id array");

    idWordArray.forEach(async id => {
      const word = await mh.word.findOne({ _id: id });
      await mh.word.updateOne(
        { _id: id, owner_id: idUser },
        { folder_id: folderId }
      );
      await updateWordCount(word.folder_id);
    });

    await updateWordCount(folderId);

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
   * responses: 200, 400, 404
   */
  put: async function scoreWord(req, res, next) {
    const wordId = req.params.wordId;
    const score = req.body;

    const word = await mh.word.updateOne({ _id: wordId }, { score: score });
    res.json(word);
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

    const word = await mh.word.updateOne(
      { _id: wordId },
      { translation: newTranslation }
    );
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
      return errors.e400(res, "Bad file Id");

    const result = await mh.wordFile.findById(fileId);

    if (isNullOrUndefined(result)) return errors.e404(res, "File not found");

    const file = result.bytes;

    var img = new Buffer(file.toString("binary"), "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length
    });
    res.end(img);
  }
};

import { Schema } from "mongoose";

/* eslint-disable */
function getNextSequence(name) {
  var ret = db.counters.findAndModify({
    query: { _id: name },
    update: { $inc: { seq: 1 } },
    new: true,
    upsert: true
  });

  return NumberLong(ret.seq);
}
/* eslint-enable */

export const RightEnum = {
  read: "read",
  write: "write",
  admin: "admin"
};

export const FileTypeEnum = {
  audio: "audio",
  orig: "orig",
  pron: "pron",
  trans: "trans",
  full: "full"
};
export const LearnModeEnum = {
  OriginalWord: "OriginalWord",
  Translation: "Translation",
  FullView: "FullView",
  Pronunciation: "Pronunciation"
};

const userSchema = Schema({
  _id: { type: Number, default: getNextSequence("userid") },
  username: String,
  tokenHash: String,
  sessionId: String,
  lastCommand: String,
  joinDate: { type: Date, default: Date.now },
  who: {
    type: String,
    enum: Object.values(RightEnum),
    default: RightEnum.read
  },
  mode: String
});

const wordFileSchema = Schema({
  word_id: Number,
  createDate: { type: Date, default: Date.now },
  bytes: Buffer,
  height: Number,
  width: Number,
  fileType: {
    type: String,
    enum: Object.values(FileTypeEnum),
    default: FileTypeEnum.full
  }
});

const folderSchema = Schema({
  _id: Number,
  name: String,
  owner_id: Number,
  createDate: { type: Date, default: Date.now }
});

const wordSchema = Schema({
  _id: Number,
  owner_id: Number,
  originalWord: String,
  pronunciation: String,
  translation: String,
  usage: String,
  syllablesCount: { type: Number, min: 1, max: 8000 },
  folder_id: Number,
  createDate: { type: Date, default: Date.now },
  score: {
    originalWordCount: Number,
    originalWordSuccessCount: Number,
    lastView: { type: Date, default: Date.now },
    lastLearned: String,
    lastLearnMode: {
      type: String,
      enum: Object.values(LearnModeEnum)
    },
    isInLearnMode: Boolean,
    rightAnswerNumber: Number,
    pronunciationCount: Number,
    pronunciationSuccessCount: Number,
    translationCount: Number,
    translationSuccessCount: Number,
    viewCount: Number,
    name: String
  }
});

export default { userSchema, wordFileSchema, folderSchema, wordSchema };

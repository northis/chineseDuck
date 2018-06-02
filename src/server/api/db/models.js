import { Schema } from "mongoose";

const userSchema = Schema({
  _id: Number,
  username: String,
  tokenHash: String,
  sessionId: String,
  lastCommand: String,
  joinDate: { type: Date, default: Date.now },
  who: {
    type: String,
    enum: ["read", "write", "admin"],
    default: "read"
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
    enum: ["audio", "orig", "pron", "trans", "full"],
    default: "full"
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
      enum: ["OriginalWord", "Translation", "FullView", "Pronunciation"]
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

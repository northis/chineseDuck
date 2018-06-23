import mongoose from "mongoose";

export const RightEnum = {
  read: "read",
  write: "write",
  admin: "admin"
};

export const RightWeightEnum = {
  read: 1,
  write: 2,
  admin: 3
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
export const CollectionsEnum = {
  users: "users",
  wordFiles: "wordFiles",
  folders: "folders",
  words: "words",
  sessions: "sessions"
};
export const ModelsEnum = {
  user: "user",
  wordFile: "wordFile",
  folder: "folder",
  word: "word",
  session: "session"
};

export const userSchema = {
  username: String,
  tokenHash: String,
  lastCommand: String,
  joinDate: { type: Date, default: new Date() },
  who: {
    type: String,
    enum: Object.values(RightEnum),
    default: RightEnum.read
  },
  mode: String,
  currentFolder_id: Number
};

export const wordFileSchema = {
  word_id: Number,
  createDate: { type: Date, default: new Date() },
  bytes: Buffer,
  height: Number,
  width: Number,
  fileType: {
    type: String,
    enum: Object.values(FileTypeEnum),
    default: FileTypeEnum.full
  }
};

export const folderSchema = {
  name: String,
  owner_id: Number,
  wordsCount: Number,
  activityDate: { type: Date, default: new Date() }
};

export const wordSchema = {
  owner_id: Number,
  originalWord: String,
  pronunciation: String,
  translation: String,
  usage: String,
  syllablesCount: { type: Number, min: 1, max: 8000 },
  folder_id: Number,
  createDate: { type: Date, default: new Date() },
  score: {
    originalWordCount: Number,
    originalWordSuccessCount: Number,
    lastView: { type: Date, default: new Date() },
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
};

export const sessionSchema = {
  _id: String,
  expires: Date,
  session: {
    cookie: {},
    passport: {
      user: Number
    }
  }
};

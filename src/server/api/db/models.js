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

export const GettingWordsStrategyEnum = {
  NewFirst: 1,
  OldFirst: 2,
  NewMostDifficult: 3,
  OldMostDifficult: 4,
  Random: 5
};

export const FileTypeEnum = {
  orig: "orig",
  pron: "pron",
  trans: "trans",
  full: "full"
};

export const PathWildcardEnum = {
  folderId: "{folderId}",
  wordId: "{wordId}",
  userId: "{userId}",
  wordEntry: "{wordEntry}",
  fileId: "{fileId}",
  userId: "{userId}",
  id: "{id}",
  count: "{count}",
  mode: "{mode}"
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
  sessions: "sessions",
  idIncrement: "counters"
};
export const ModelsEnum = {
  user: "user",
  wordFile: "wordFile",
  idIncrement: "idIncrement",
  folder: "folder",
  word: "word",
  session: "session"
};

export const StrategyEnum = {
  newFirst: "NewFirst",
  oldFirst: "OldFirst",
  newMostDifficult: "NewMostDifficult",
  oldMostDifficult: "OldMostDifficult",
  random: "Random"
};

export const userSchema = {
  _id: Number,
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

export const wordFileBodySchema = {
  id: String,
  createDate: { type: Date, default: new Date() },
  height: Number,
  width: Number
};

export const wordFileInfoSchema = {
  bytes: Buffer
};

export const wordFileInfoSchemaOld = {
  _id: String,
  createDate: { type: Date, default: new Date() },
  height: Number,
  word_id: Number,
  width: Number,
  fileType: {
    type: String,
    enum: Object.values(FileTypeEnum),
    default: FileTypeEnum.full
  }
};

export const folderSchema = {
  _id: Number,
  name: String,
  owner_id: Number,
  wordsCount: Number,
  activityDate: { type: Date, default: new Date() }
};

export const wordSchema = {
  _id: Number,
  owner_id: Number,
  originalWord: String,
  pronunciation: String,
  translation: String,
  usage: String,
  syllablesCount: { type: Number, min: 1, max: 8000 },
  folder_id: Number,
  lastModified: { type: Date, default: new Date() },
  full: wordFileBodySchema,
  trans: wordFileBodySchema,
  pron: wordFileBodySchema,
  orig: wordFileBodySchema,
  score: {
    originalWordCount: Number,
    originalWordSuccessCount: Number,
    lastView: { type: Date, default: new Date() },
    lastLearned: { type: Date, default: new Date() },
    lastLearnMode: { type: String, enum: Object.values(LearnModeEnum) },
    isInLearnMode: Boolean,
    rightAnswerNumber: Number,
    pronunciationCount: Number,
    pronunciationSuccessCount: Number,
    translationCount: Number,
    translationSuccessCount: Number,
    viewCount: Number
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

export const idIncrementSchema = {
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
};

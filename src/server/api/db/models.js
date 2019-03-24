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
  mode: { type: String, enum: Object.values(StrategyEnum) },
  currentFolder_id: Number,
  currentWord_id: Number
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
  folder_id: { type: Number, default: 0 },
  lastModified: { type: Date, default: new Date() },
  full: wordFileBodySchema,
  trans: wordFileBodySchema,
  pron: wordFileBodySchema,
  orig: wordFileBodySchema,
  score: {
    originalWordCount: { type: Number, default: 0 },
    originalWordSuccessCount: { type: Number, default: 0 },
    lastView: { type: Date, default: new Date() },
    lastLearned: { type: Date, default: new Date() },
    lastLearnMode: {
      type: String,
      enum: Object.values(LearnModeEnum)
    },
    rightAnswerNumber: { type: Number, default: 0 },
    pronunciationCount: { type: Number, default: 0 },
    pronunciationSuccessCount: { type: Number, default: 0 },
    translationCount: { type: Number, default: 0 },
    translationSuccessCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }
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

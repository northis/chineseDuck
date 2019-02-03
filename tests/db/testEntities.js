import * as models from "../../src/server/api/db/models";
import { DebugKeys } from "../../config/common";
import { testWordImg } from "../db/fileB64";

export const userWrite = {
  _id: DebugKeys.user_id,
  username: "userWrite",
  tokenHash: "",
  lastCommand: "/LearnWriting",
  joinDate: new Date("2018-06-02T03:04:05"),
  who: models.RightEnum.write,
  mode: models.GettingWordsStrategyEnum.Random,
  currentFolder_id: 0,
  currentWord_id: 0
};

export const userAdmin = {
  _id: DebugKeys.admin_id,
  username: "userAdmin",
  tokenHash: DebugKeys.password_hash,
  lastCommand: "/view",
  joinDate: new Date("2018-06-01T01:02:03"),
  who: models.RightEnum.admin,
  mode: models.GettingWordsStrategyEnum.Random,
  currentFolder_id: 0,
  currentWord_id: 0
};

export const wordBreakfast = {
  owner_id: 0,
  originalWord: "早饭",
  pronunciation: "zǎo|fàn",
  translation: "Breakfast",
  usage: "我等早饭",
  syllablesCount: 2,
  folder_id: 0,
  lastModified: new Date("2018-06-01T06:05:06"),
  full: {
    id: "",
    createDate: new Date("2018-06-01T05:05:05"),
    height: 145,
    width: 251
  },
  trans: {
    id: "",
    createDate: new Date("2018-06-01T05:05:06"),
    height: 145,
    width: 251
  },
  pron: {
    id: "",
    createDate: new Date("2018-06-01T05:05:07"),
    height: 145,
    width: 251
  },
  orig: {
    id: "",
    createDate: new Date("2018-06-01T05:05:08"),
    height: 145,
    width: 251
  },
  score: {
    originalWordCount: 5,
    originalWordSuccessCount: 4,
    lastView: new Date("2018-07-01T05:05:08"),
    lastLearned: new Date("2018-07-01T05:01:07"),
    lastLearnMode: models.LearnModeEnum.OriginalWord,
    rightAnswerNumber: 0,
    pronunciationCount: 5,
    pronunciationSuccessCount: 3,
    translationCount: 5,
    translationSuccessCount: 2,
    viewCount: 7
  }
};

export const wordDinner = {
  owner_id: 0,
  originalWord: "午饭",
  pronunciation: "wǔ|fàn",
  translation: "Dinner",
  usage: "我等午饭",
  syllablesCount: 2,
  folder_id: 0,
  lastModified: new Date("2018-06-01T06:05:06"),
  full: {
    createDate: new Date("2018-06-01T05:05:05"),
    height: 145,
    width: 251
  },
  trans: {
    createDate: new Date("2018-06-01T05:05:06"),
    height: 145,
    width: 251
  },
  pron: {
    createDate: new Date("2018-06-01T05:05:07"),
    height: 145,
    width: 251
  },
  orig: {
    createDate: new Date("2018-06-01T05:05:08"),
    height: 145,
    width: 251
  },
  score: {
    originalWordCount: 7,
    originalWordSuccessCount: 5,
    lastView: new Date("2018-07-01T05:05:08"),
    lastLearned: new Date("2018-07-01T05:01:07"),
    lastLearnMode: models.LearnModeEnum.Pronunciation,
    rightAnswerNumber: 1,
    pronunciationCount: 6,
    pronunciationSuccessCount: 4,
    translationCount: 6,
    translationSuccessCount: 3,
    viewCount: 9
  }
};

export const wordSupper = {
  owner_id: 0,
  originalWord: "晚饭",
  pronunciation: "wǎn|fàn",
  translation: "Supper",
  usage: "我等晚饭",
  syllablesCount: 2,
  folder_id: 0,
  lastModified: new Date("2018-06-01T06:05:06"),
  full: {
    createDate: new Date("2018-06-01T05:05:05"),
    height: 145,
    width: 251
  },
  trans: {
    createDate: new Date("2018-06-01T05:05:06"),
    height: 145,
    width: 251
  },
  pron: {
    createDate: new Date("2018-06-01T05:05:07"),
    height: 145,
    width: 251
  },
  orig: {
    createDate: new Date("2018-06-01T05:05:08"),
    height: 145,
    width: 251
  },
  score: {
    originalWordCount: 7,
    originalWordSuccessCount: 5,
    lastView: new Date("2018-07-01T05:05:08"),
    lastLearned: new Date("2018-07-01T05:01:07"),
    lastLearnMode: models.LearnModeEnum.Pronunciation,
    rightAnswerNumber: 1,
    pronunciationCount: 6,
    pronunciationSuccessCount: 4,
    translationCount: 6,
    translationSuccessCount: 3,
    viewCount: 9
  }
};

export const folderTemplate = {
  name: "folder Template",
  owner_id: 0,
  wordsCount: 0,
  activityDate: new Date("2018-07-01T05:01:01")
};

export const wordFileInfoTemplate = {
  bytes: testWordImg
};

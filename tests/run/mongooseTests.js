import { expect } from "chai";
import mongoose from "mongoose";
import { testWordImg } from "../db/fileB64";
import { mh } from "../../src/server/api/db/index";

import * as models from "../../src/server/api/db/models";

let testUserName = "testUser";
let testFolderName = "testFolder";
let originalWordValue = "自行车";

export default () => {
  let userId = 0;
  let folderId = 0;
  let wordId = 0;

  it("user", async function() {
    let userObj = {
      username: testUserName,
      tokenHash: "tokenHash",
      sessionId: "sessionId",
      lastCommand: "lastCommand",
      joinDate: new Date(),
      who: models.RightEnum.write,
      mode: "mode"
    };
    await mh.user.create(userObj);
    const insertedUser = await mh.user.findOne({ username: testUserName });
    expect(userObj.username).to.eql(insertedUser.username);
    userId = insertedUser._id;
  });

  it("folder", async function() {
    let folderObj = {
      name: testFolderName,
      owner_id: userId,
      wordsCount: 0,
      activityDate: new Date()
    };
    await mh.folder.create(folderObj);
    const insertedFolder = await mh.folder.findOne({ owner_id: userId });
    folderId = insertedFolder._id;

    expect(folderObj.testFolderName).to.eql(insertedFolder.testFolderName);
    return Promise.resolve();
  });

  it("word", async function() {
    let wordObj = {
      originalWord: originalWordValue,
      pronunciation: "zi|xing|che",
      translation: "велосипед",
      usage: "我有一个自行车",
      syllablesCount: 3,
      full: {
        height: 70,
        width: 251,
        fileType: models.FileTypeEnum.full
      },
      trans: {
        height: 70,
        width: 251,
        fileType: models.FileTypeEnum.trans
      },
      pron: {
        height: 70,
        width: 251,
        fileType: models.FileTypeEnum.pron
      },
      orig: {
        height: 70,
        width: 251,
        fileType: models.FileTypeEnum.orig
      },
      score: {
        originalWordCount: 0,
        originalWordSuccessCount: 0,
        lastView: new Date(),
        isInLearnMode: false,
        pronunciationCount: 0,
        pronunciationSuccessCount: 0,
        translationCount: 0,
        translationSuccessCount: 0,
        viewCount: 0
      },
      owner_id: userId,
      folder_id: folderId
    };
    await mh.word.create(wordObj);
    const insertedWord = await mh.word.findOne({
      originalWord: originalWordValue
    });
    wordId = insertedWord._id;

    expect(wordObj.originalWord).to.eql(insertedWord.originalWord);
    return Promise.resolve();
  });

  it("wordFile", async function() {
    let wordFileObj = {
      bytes: new Buffer(testWordImg, "base64")
    };
    let newWordFile = await mh.wordFile.create(wordFileObj);
    const insertedWordFile = await mh.wordFile.findOne({
      _id: newWordFile._id
    });
    expect(wordFileObj.bytes).to.eql(insertedWordFile.bytes);
    return Promise.resolve();
  });
};

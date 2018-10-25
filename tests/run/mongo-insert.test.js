import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { expect } from "chai";
import { testWordImg } from "../db/fileB64";

import * as models from "../../src/server/api/db/models";
import { ModelsHolder } from "../../src/server/api/db/modelsHolder";

let mongoServer;
let modelsHolder = new ModelsHolder();
let testUserName = "testUser";
let testFolderName = "testFolder";
let originalWordValue = "自行车";

before(done => {
  mongoServer = new MongodbMemoryServer();
  mongoServer
    .getConnectionString()
    .then(mongoUri => {
      return mongoose.connect(
        mongoUri,
        err => {
          if (err) done(err);
        }
      );
    })
    .then(() => done());
  modelsHolder.init();

});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe("Initial set of tests", function () {
  let userId = 0;
  let folderId = 0;
  let wordId = 0;

  it("user", async function () {
    let userObj = {
      username: testUserName,
      tokenHash: "tokenHash",
      sessionId: "sessionId",
      lastCommand: "lastCommand",
      joinDate: new Date(),
      who: models.RightEnum.write,
      mode: "mode"
    };
    await modelsHolder.user.create(userObj);
    const insertedUser = await modelsHolder.user.findOne({
      username: testUserName
    });
    expect(userObj.username).to.eql(insertedUser.username);
    userId = insertedUser._id;
  });

  it("folder", async function () {
    let folderObj = {
      name: testFolderName,
      owner_id: userId
    };
    await modelsHolder.folder.create(folderObj);
    const insertedFolder = await modelsHolder.folder.findOne({
      owner_id: userId
    });
    folderId = insertedFolder._id;

    expect(folderObj.testFolderName).to.eql(insertedFolder.testFolderName);
  });

  it("word", async function () {
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
    await modelsHolder.word.create(wordObj);
    const insertedWord = await modelsHolder.word.findOne({
      originalWord: originalWordValue
    });
    wordId = insertedWord._id;

    expect(wordObj.originalWord).to.eql(insertedWord.originalWord);
  });

  it("wordFile", async function () {
    let wordFileObj = {
      word_id: wordId,
      height: 70,
      width: 251,
      fileType: models.FileTypeEnum.orig,
      bytes: new Buffer(testWordImg, "base64")
    };
    await modelsHolder.wordFile.create(wordFileObj);
    const insertedWordFile = await modelsHolder.wordFile.findOne({
      word_id: wordId
    });
    expect(wordFileObj.bytes).to.eql(insertedWordFile.bytes);
  });
});

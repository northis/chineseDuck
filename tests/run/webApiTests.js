import { Settings, DebugKeys } from "../../config/common";
import {
  RightWeightEnum,
  PathWildcardEnum
} from "../../src/server/api/db/models";
import request from "supertest";
import { assert } from "chai";
import * as uj from "url-join";
import * as rt from "../../src/shared/routes.gen";
import * as srv from "../../src/server/index";
import mh from "../../src/server/api/db";
import * as testEntities from "../db/testEntities";
import * as moment from "moment";
import { isNullOrUndefined } from "util";
import * as fileB64 from "../db/fileB64";

const routes = rt.default;
const urlJoin = uj.default;
let cookie = "";
let cookieAdmin = "";

export default () => {
  testUser();
  testFolder();
  testWord();
  testService();
  testStudy();
};

function testUser() {
  it(`${routes._user_auth.value} - post`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._user_auth.value);
    const response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({ phone: "+" + DebugKeys.phone });

    assert.ok(response.status === 200);

    const resTest = JSON.parse(response.res.text);
    assert.ok(resTest.hash == DebugKeys.phone_code_hash);
  });

  it(`${routes._user_login.value} - post`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._user_login.value);
    let response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        id: "+" + DebugKeys.phone,
        code: DebugKeys.phone_code + "",
        hash: DebugKeys.phone_code_hash,
        remember: false
      });

    assert.ok(response.status === 200);

    let cookieRaw = response.header["set-cookie"];
    assert.ok(cookieRaw.length > 0);
    cookie = cookieRaw[0];

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        id: DebugKeys.admin_id + "",
        code: DebugKeys.password,
        remember: true
      });

    assert.ok(response.status === 200);

    cookieRaw = response.header["set-cookie"];
    assert.ok(cookieRaw.length > 0);
    cookieAdmin = cookieRaw[0];
  });

  it(`${routes._user_currentFolder__folderId_.value} - put`, async () => {
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });

    let url = urlJoin(
      Settings.apiPrefix,
      routes._folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );

    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    const userDb = await mh.user.findOne({ _id: DebugKeys.user_id });

    assert.ok(response.status === 200);
    assert.ok(folderDb._id === userDb.currentFolder_id);

    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });

    url = urlJoin(
      Settings.apiPrefix,
      routes._folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send({});
    assert.ok(response.status === 401);
  });

  it(`${routes._user.value} - post`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._user.value);
    const user = testEntities.userWrite;
    user._id = DebugKeys.other_user_id;

    let response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(user);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(user);

    assert.ok(response.status === 200);

    let userDb = await mh.user.findOne({ _id: user._id });
    assert.ok(userDb.username === user.username);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send(user);
    assert.ok(response.status === 401);
  });

  it(`${routes._user__userId_.value} - get`, async () => {
    let userDb = await mh.user.findOne({ _id: DebugKeys.user_id });

    const url = urlJoin(
      Settings.apiPrefix,
      routes._user__userId_.value.replace(PathWildcardEnum.userId, userDb._id)
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin]);
    assert.ok(response.status === 200);
    assert.ok(response.body.username === userDb.username);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });

  it(`${routes._user__userId_.value} - put`, async () => {
    let userDb = await mh.user.findOne({ _id: DebugKeys.user_id });

    userDb.username = DebugKeys.not_existing_file_id;
    const url = urlJoin(
      Settings.apiPrefix,
      routes._user__userId_.value.replace(PathWildcardEnum.userId, userDb._id)
    );

    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(userDb);
    assert.ok(response.status === 200);
    userDb = await mh.user.findOne({ _id: DebugKeys.user_id });
    assert.ok(userDb.username === DebugKeys.not_existing_file_id);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send(userDb);

    assert.ok(response.status === 401);
  });
  it(`${routes._user__userId_.value} - delete`, async () => {
    let userDb = await mh.user.findOne({ _id: DebugKeys.user_id });
    const url = urlJoin(
      Settings.apiPrefix,
      routes._user__userId_.value.replace(PathWildcardEnum.userId, userDb._id)
    );

    let response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send({});
    assert.ok(response.status === 200);
    userDb = await mh.user.findOne({ _id: DebugKeys.user_id });
    assert.ok(isNullOrUndefined(userDb));

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .send({});

    assert.ok(response.status === 401);
  });
}
function testFolder() {
  it(`${routes._folder.value} - get`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._folder.value);

    const response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);

    assert.ok(response.status === 200);
    assert.ok(response.body.length >= 2);
  });

  it(`${routes._folder.value} - post`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._folder.value);
    const folder = testEntities.folderTemplate;

    const newFolderName = Date.now().toString();
    folder.name = newFolderName;

    let response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(folder);
    let folderDb = await mh.folder.findOne({ name: newFolderName });

    assert.ok(response.status === 200);
    assert.ok(!isNullOrUndefined(folderDb));

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(folder);
    assert.ok(response.status === 409);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send(folder);
    assert.ok(response.status === 401);
  });

  it(`${routes._folder__folderId_.value} - put`, async () => {
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });

    const url = urlJoin(
      Settings.apiPrefix,
      routes._folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );

    let updatedFolder = folderDb;
    updatedFolder.name = "newName";

    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(updatedFolder);
    folderDb = await mh.folder.findOne({ _id: folderDb._id });

    assert.ok(response.status === 200);
    assert.ok(updatedFolder.name === folderDb.name);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send(updatedFolder);

    assert.ok(response.status === 401);
  });

  it(`${routes._folder_user__userId_.value} - get`, async () => {
    let foldersDb = await mh.folder.find({ owner_id: DebugKeys.user_id });

    const url = urlJoin(
      Settings.apiPrefix,
      routes._folder_user__userId_.value.replace(
        PathWildcardEnum.userId,
        DebugKeys.user_id
      )
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin]);
    assert.ok(response.status === 200);

    foldersDb.forEach(folder => {
      assert.ok(response.body.some(a => a._id === folder._id));
    });
    assert.ok(response.body.some(a => a._id === 0));

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });

  it(`${routes._folder_user__userId_.value} - post`, async () => {
    const url = urlJoin(
      Settings.apiPrefix,
      routes._folder_user__userId_.value.replace(
        PathWildcardEnum.userId,
        DebugKeys.user_id
      )
    );
    const folder = testEntities.folderTemplate;

    folder.name = DebugKeys.not_existing_file_id;
    folder.owner_id = DebugKeys.user_id;

    let response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(folder);
    assert.ok(response.status === 200);
    let folderDb = await mh.folder.findOne({
      _id: response.body._id
    });
    assert.ok(!isNullOrUndefined(folderDb));

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({});
    assert.ok(response.status === 401);
  });

  it(`${routes._folder__folderId_.value} - delete`, async () => {
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });
    let folderId = folderDb._id;
    let url = urlJoin(
      Settings.apiPrefix,
      routes._folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderId
      )
    );

    let response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({});
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send({});
    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });
    assert.ok(response.status === 200);
    assert.ok(isNullOrUndefined(folderDb));

    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });
    folderId = folderDb._id;
    url = urlJoin(
      Settings.apiPrefix,
      routes._folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );
    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send({});
    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });
    const wordDb = await mh.word.findOne({ folder_id: folderId });

    assert.ok(response.status === 200);
    assert.ok(isNullOrUndefined(folderDb));
    assert.ok(isNullOrUndefined(wordDb));

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .send({});
    assert.ok(response.status === 401);
  });
}

function testWord() {
  it(`${routes._word.value} - post`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._word.value);
    let newWord = testEntities.wordSupper;
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });

    newWord.owner_id = DebugKeys.user_id;
    newWord.folder_id = folderDb._id;

    let response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(newWord);

    newWord = await mh.word.findOne({ _id: response.body._id });

    assert.ok(response.status === 200);
    assert.ok(newWord._id === response.body._id);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(newWord);
    assert.ok(response.status === 409);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send(newWord);
    assert.ok(response.status === 401);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(newWord);
    assert.ok(response.status === 403);
  });

  it(`${routes._word.value} - put`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._word.value);
    let word = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    const wordToUpdate = testEntities.wordSupper;
    const id = word._id;
    wordToUpdate._id = id;
    wordToUpdate.full.id = word.full.id;
    wordToUpdate.orig.id = word.orig.id;
    wordToUpdate.trans.id = word.trans.id;
    wordToUpdate.pron.id = word.pron.id;

    assert.ok(wordToUpdate.originalWord !== word.originalWord);
    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(wordToUpdate);

    assert.ok(response.status === 200);

    word = await mh.word.findOne({ _id: id });
    assert.ok(wordToUpdate.originalWord === word.originalWord);
    assert.ok(wordToUpdate.pronunciation === word.pronunciation);
    assert.ok(wordToUpdate.translation === word.translation);
    assert.ok(wordToUpdate.usage === word.usage);
    assert.ok(wordToUpdate.syllablesCount === word.syllablesCount);

    assert.ok(wordToUpdate.score.viewCount === word.score.viewCount);
    assert.ok(
      wordToUpdate.score.translationCount === word.score.translationCount
    );
    assert.ok(
      wordToUpdate.score.translationSuccessCount ===
        word.score.translationSuccessCount
    );
    assert.ok(
      wordToUpdate.score.pronunciationCount === word.score.pronunciationCount
    );
    assert.ok(
      wordToUpdate.score.pronunciationSuccessCount ===
        word.score.pronunciationSuccessCount
    );
    assert.ok(
      wordToUpdate.score.originalWordCount === word.score.originalWordCount
    );
    assert.ok(
      wordToUpdate.score.originalWordSuccessCount ===
        word.score.originalWordSuccessCount
    );

    assert.ok(wordToUpdate.full.height === word.full.height);
    assert.ok(
      wordToUpdate.full.createDate.getTime() === word.full.createDate.getTime()
    );
    assert.ok(wordToUpdate.full.width === word.full.width);
    assert.ok(wordToUpdate.orig.height === word.orig.height);
    assert.ok(
      wordToUpdate.orig.createDate.getTime() === word.orig.createDate.getTime()
    );
    assert.ok(wordToUpdate.orig.width === word.orig.width);
    assert.ok(wordToUpdate.pron.height === word.pron.height);
    assert.ok(
      wordToUpdate.pron.createDate.getTime() === word.pron.createDate.getTime()
    );
    assert.ok(wordToUpdate.pron.width === word.pron.width);
    assert.ok(wordToUpdate.trans.height === word.trans.height);
    assert.ok(
      wordToUpdate.trans.createDate.getTime() ===
        word.trans.createDate.getTime()
    );
    assert.ok(wordToUpdate.trans.width === word.trans.width);

    wordToUpdate._id = DebugKeys.notAnumber;
    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(wordToUpdate);
    assert.ok(response.status === 400);
  });

  it(`${routes._word_folder__folderId_.value} - put`, async () => {
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });
    let words = await mh.word
      .find({ owner_id: DebugKeys.user_id })
      .select({ _id: 1 });

    let url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );
    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(words);
    assert.ok(response.status === 200);

    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });
    url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send(words);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send(words);
    assert.ok(response.status === 401);
  });

  it(`${
    routes._word_folder__folderId__count__count_.value
  } - get`, async () => {
    let folderDb = await mh.folder.findOne({ owner_id: DebugKeys.user_id });
    let words = await mh.word
      .find({ owner_id: DebugKeys.user_id })
      .select({ _id: 1 });

    let url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId__count__count_.value
        .replace(PathWildcardEnum.folderId, folderDb._id)
        .replace(PathWildcardEnum.count, 0)
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 200);
    assert.ok(response.body.length === words.length);

    const limit = 1;
    url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId__count__count_.value
        .replace(PathWildcardEnum.folderId, folderDb._id)
        .replace(PathWildcardEnum.count, limit)
    );
    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 200);
    assert.ok(response.body.length === limit);

    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });
    url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId__count__count_.value.replace(
        PathWildcardEnum.folderId,
        folderDb._id
      )
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });

  it(`${routes._word__wordId__rename.value} - put`, async () => {
    let wordsDb = await mh.word.find({ owner_id: DebugKeys.user_id });

    let wordDbId = wordsDb[0]._id;
    let url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId__rename.value.replace(
        PathWildcardEnum.wordId,
        wordDbId
      )
    );

    const newTranslation = wordsDb[1].translation;
    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({ newTranslation: newTranslation });

    let wordDb = await mh.word.findOne({ _id: wordDbId });
    assert.ok(response.status === 200);
    assert.ok(wordDb.translation === newTranslation);

    wordDb = await mh.word.findOne({ owner_id: DebugKeys.admin_id });

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId__rename.value.replace(
        PathWildcardEnum.wordId,
        wordDb._id
      )
    );

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({ newTranslation: newTranslation });
    assert.ok(response.status === 403);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId__rename.value.replace(
        PathWildcardEnum.wordId,
        DebugKeys.not_existing_word_id
      )
    );

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({ newTranslation: newTranslation });
    assert.ok(response.status === 404);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId__rename.value.replace(
        PathWildcardEnum.wordId,
        DebugKeys.notAnumber
      )
    );

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie])
      .send({ newTranslation: newTranslation });
    assert.ok(response.status === 400);

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send({ newTranslation: newTranslation });
    assert.ok(response.status === 401);
  });

  it(`${routes._word__wordId__score.value} - put`, async () => {
    let wordDb = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    let wordId = wordDb._id;
    let url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId__score.value.replace(PathWildcardEnum.wordId, wordId)
    );

    let newScore = testEntities.wordDinner.score;
    newScore.originalWordCount++;

    let response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin])
      .send(JSON.stringify(newScore));
    wordDb = await mh.word.findOne({ _id: wordId });

    assert.ok(response.status === 200);
    assert.ok(newScore.originalWordCount === wordDb.score.originalWordCount);
  });

  it(`${routes._word__wordId_.value} - get`, async () => {
    let wordDb = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    let wordId = wordDb._id;

    let url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId_.value.replace(PathWildcardEnum.wordId, wordId)
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    wordDb = await mh.word.findOne({ _id: wordId });

    assert.ok(response.status === 200);
    assert.ok(wordDb.originalWord === response.body.originalWord);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId_.value.replace(
        PathWildcardEnum.wordId,
        DebugKeys.not_existing_word_id
      )
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 404);

    wordDb = await mh.word.findOne({ owner_id: DebugKeys.admin_id });
    wordId = wordDb._id;

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId_.value.replace(PathWildcardEnum.wordId, wordId)
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });

  it(`${routes._word_file__fileId_.value} - get`, async () => {
    let wordDb = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    let url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        wordDb.full.id
      )
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "image/png");
    assert.ok(response.status === 200);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        DebugKeys.notAnumber
      )
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "image/png");
    assert.ok(response.status === 400);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        DebugKeys.not_existing_file_id
      )
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "image/png");
    assert.ok(response.status === 404);
  });

  it(`${routes._word_file__fileId_.value} - delete`, async () => {
    let wordDb = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    let url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        wordDb.full.id
      )
    );

    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "image/png");
    assert.ok(response.status === 200);

    const fileId = response.body._id;

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);

    response = await request(srv.default.app)
      .delete(url)
      .set("Cookie", [cookie])
      .set("Content-Type", "application/json");
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .delete(url)
      .set("Cookie", [cookieAdmin])
      .set("Content-Type", "application/json");
    assert.ok(response.status === 200);

    const wordFile = await mh.wordFile.findOne({ _id: fileId });
    assert.ok(isNullOrUndefined(wordFile));

    url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        DebugKeys.notAnumber
      )
    );

    response = await request(srv.default.app)
      .delete(url)
      .set("Cookie", [cookieAdmin])
      .set("Content-Type", "application/json");
    assert.ok(response.status === 400);

    url = urlJoin(
      Settings.apiPrefix,
      routes._word_file__fileId_.value.replace(
        PathWildcardEnum.fileId,
        DebugKeys.not_existing_file_id
      )
    );

    response = await request(srv.default.app)
      .get(url)
      .set("Cookie", [cookieAdmin])
      .set("Content-Type", "application/json");
    assert.ok(response.status === 404);
  });

  it(`${routes._word_file.value} - post`, async () => {
    const fileBody = fileB64.testWordImg;
    let url = urlJoin(Settings.apiPrefix, routes._word_file.value);
    let response = await request(srv.default.app)
      .post(url)
      .set("Cookie", [cookieAdmin])
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ bytes: fileBody }));

    assert.ok(response.status === 200);

    const fileId = response.body;

    const wordFile = await mh.wordFile.findOne({ _id: fileId });
    assert.ok(wordFile.bytes == fileBody);

    response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ bytes: fileBody }));
    assert.ok(response.status === 401);

    response = await request(srv.default.app)
      .post(url)
      .set("Cookie", [cookie])
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ bytes: fileBody }));
    assert.ok(response.status === 403);
  });

  it(`${routes._word__wordId_.value} - delete`, async () => {
    let wordDb = await mh.word.findOne({ owner_id: DebugKeys.user_id });
    let wordId = wordDb._id;

    let url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId_.value.replace(PathWildcardEnum.wordId, wordId)
    );
    let response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    wordDb = await mh.word.findOne({ _id: wordId });

    assert.ok(response.status === 200);
    assert.ok(isNullOrUndefined(wordDb));

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 404);

    wordDb = await mh.word.findOne({ owner_id: DebugKeys.admin_id });
    wordId = wordDb._id;

    url = urlJoin(
      Settings.apiPrefix,
      routes._word__wordId_.value.replace(PathWildcardEnum.wordId, wordId)
    );
    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .delete(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });

  it(`${
    routes._word_user__userId__search__wordEntry_.value
  } - get`, async () => {
    let wordDb = await mh.word.findOne({
      owner_id: DebugKeys.user_id,
      originalWord: testEntities.wordDinner.originalWord
    });

    let url = urlJoin(
      Settings.apiPrefix,
      routes._word_user__userId__search__wordEntry_.value
        .replace(PathWildcardEnum.userId, DebugKeys.user_id)
        .replace(
          PathWildcardEnum.wordEntry,
          encodeURIComponent(testEntities.wordDinner.originalWord.slice(1)) // 饭
        )
    );
    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookieAdmin]);
    assert.ok(response.status === 200);
    assert.ok(response.body.some(a => a._id === wordDb._id));

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 403);

    response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");
    assert.ok(response.status === 401);
  });
}

function testStudy() {
  it(`${routes._word_user__userId__nextWord.value} - put`, async () => {});

  it(`${routes._word_user__userId__answers.value} - get`, async () => {});
}

function testService() {
  it(`${routes._service_datetime.value} - get`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._service_datetime.value);
    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");

    const sinceLastSec = moment
      .duration(new Date(response.body) - new Date())
      .asSeconds();

    assert.ok(sinceLastSec < 60);
  });
}

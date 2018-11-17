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

const routes = rt.default;
const urlJoin = uj.default;
let cookie = "";
let cookieAdmin = "";

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

  it(`${routes._folder.value} - post`, async () => {});

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

  it(`${routes._folder__folderId_.value} - delete`, async () => {});
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
    const wordToUpdate = testEntities.wordDinner;
    const id = word._id;
    wordToUpdate._id = id;

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

  it(`${routes._word_folder__folderId_.value} - get`, async () => {
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
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);
    assert.ok(response.status === 200);
    assert.ok(response.body.length === words.length);

    folderDb = await mh.folder.findOne({ owner_id: DebugKeys.admin_id });
    url = urlJoin(
      Settings.apiPrefix,
      routes._word_folder__folderId_.value.replace(
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
}

function testService() {
  it(`${routes._service_datetime.value} - get`, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._service_datetime.value);
    let response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json");

    const sinceLastSec = moment
      .duration(new Date(response.body.datetime) - new Date())
      .asSeconds();

    assert.ok(sinceLastSec < 60);
  });
}

export default () => {
  testUser();
  testFolder();
  testWord();
  testService();
};

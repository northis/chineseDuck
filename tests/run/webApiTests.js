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

const routes = rt.default;
const urlJoin = uj.default;
let cookie = "";
let cookieAdmin = "";

function testUser() {
  it(routes._user_auth.value, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._user_auth.value);
    const response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({ phone: "+" + DebugKeys.phone });

    assert.ok(response.status === 200);

    const resTest = JSON.parse(response.res.text);
    assert.ok(resTest.hash == DebugKeys.phone_code_hash);
  });

  it(routes._user_login.value, async () => {
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
  it(routes._folder.value, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._folder.value);

    const response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);

    assert.ok(response.status === 200);
    assert.ok(response.body.length >= 2);
  });

  it(routes._folder__folderId_.value, async () => {
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

    const response1 = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send(updatedFolder);

    assert.ok(response1.status === 401);
  });
}

function testWord() {
  it(routes._word.value, async () => {
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

    // response = await request(srv.default.app)
    //   .post(url)
    //   .set("Content-Type", "application/json")
    //   .send(newWord);
    // assert.ok(response.status === 401);
  });
}

export default () => {
  testUser();
  testFolder();
  testWord();
};

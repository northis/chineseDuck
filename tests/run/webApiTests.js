import { Settings, DebugKeys } from "../../config/common";
import request from "supertest";
import { assert } from "chai";
import * as uj from "url-join";
import * as rt from "../../src/shared/routes.gen";
import { init } from "../db/testDbInit";
import * as srv from "../../src/server/index";
import { fromJSON } from "tough-cookie";

const routes = rt.default;
const urlJoin = uj.default;

export default () => {
  // const folderUrl = urlJoin(
  //   Settings.apiPrefix,
  //   routes._folder__folderId_.value.replace("{folderId}", 0)
  // );

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

  let cookie = "";

  it(routes._user_login.value, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._user_login.value);
    const response = await request(srv.default.app)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        id: "+" + DebugKeys.phone,
        code: DebugKeys.phone_code + "",
        hash: DebugKeys.phone_code_hash,
        remember: false
      });

    assert.ok(response.status === 200);

    const cookieRaw = response.header["set-cookie"];
    assert.ok(cookieRaw.length > 0);
    cookie = cookieRaw[0];
  });

  it(routes._folder.value, async () => {
    const url = urlJoin(Settings.apiPrefix, routes._folder.value);

    const response = await request(srv.default.app)
      .get(url)
      .set("Content-Type", "application/json")
      .set("Cookie", [cookie]);

    console.log(response.body);
    assert.ok(response.status === 200);
  });
};

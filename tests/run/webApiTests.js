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

    response = await request(srv.default.app)
      .put(url)
      .set("Content-Type", "application/json")
      .send(updatedFolder);

    assert.ok(response.status === 302 || response.status === 401);
  });
}

function authorizeTests() {
  const pathWildCardMapper = {
    [PathWildcardEnum.folderId]: "0",
    [PathWildcardEnum.fileId]: "123",
    [PathWildcardEnum.id]: DebugKeys.user_id,
    [PathWildcardEnum.userId]: DebugKeys.user_id,
    [PathWildcardEnum.wordEntry]: testEntities.wordBreakfast.originalWord,
    [PathWildcardEnum.wordId]: "0"
  };

  for (const key in routes) {
    if (routes.hasOwnProperty(key)) {
      const route = routes[key];

      let template = route.value;
      for (const keyWildcard in pathWildCardMapper) {
        template = template.replace(
          keyWildcard,
          pathWildCardMapper[keyWildcard]
        );
      }

      for (const keyAction in route.actions) {
        if (route.actions.hasOwnProperty(keyAction)) {
          const rights = route.actions[keyAction];
          const minRouteWeight = Math.min(rights.map(a => RightWeightEnum[a]));

          if (minRouteWeight > RightWeightEnum.read) {
            const url = urlJoin(Settings.apiPrefix, template);

            it(`${keyAction}: ${url}`, async () => {
              let response = await request(srv.default.app)
                [keyAction](encodeURIComponent(url))
                .set("Content-Type", "application/json")
                .send({});

              assert.ok(response.status > 299 && response.status < 500);
            });
          }
        }
      }
    }
  }
}

export default () => {
  testUser();
  testFolder();
  describe("authorize tests", authorizeTests);
};

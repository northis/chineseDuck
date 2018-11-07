import { getExpressApp } from "./_first.test";
import { Settings } from "../../config/common";
import request from "supertest";
import { assert } from "chai";
import * as uj from "url-join";
import * as rt from "../../src/shared/routes.gen";
const routes = rt.default;
const urlJoin = uj.default;
let app = null;

before(done => {
  app = getExpressApp();
  done();
});

describe("web api tests", function() {
  const folderUrl = urlJoin(
    Settings.apiPrefix,
    routes._folder__folderId_.value.replace("{folderId}", 0)
  );
  it("test " + folderUrl, async () => {
    const response = await request(app).get(folderUrl);
    console.log(response.status);

    assert.ok(response.status === 200);
  });
});

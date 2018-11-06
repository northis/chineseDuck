import { getExpressApp } from "./_first.test";
import { Settings } from "../../config/common";
import request from "supertest";
import * as url from "url";
import * as rt from "../../src/shared/routes.gen";
const routes = rt.default;
let app = null;
const localApiUrl = Settings.getLocalApiAddress();

before(done => {
  app = getExpressApp();
  done();
});

describe("web api tests", function () {
  const folderUrl = url.resolve(localApiUrl, routes._folder__folderId_.value.replace("{folderId}", 0));
  it("test " + folderUrl, async () => {

    const rc = await request(app)
      .get(folderUrl);

  });
});

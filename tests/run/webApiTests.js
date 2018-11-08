import { getExpressApp } from "./main.test";
import { Settings } from "../../config/common";
import request from "supertest";
import { assert } from "chai";
import * as uj from "url-join";
import * as rt from "../../src/shared/routes.gen";
import { init } from "../db/testDbInit";

const routes = rt.default;
const urlJoin = uj.default;

export default app => {
  const folderUrl = urlJoin(
    Settings.apiPrefix,
    routes._folder__folderId_.value.replace("{folderId}", 0)
  );
  it("test " + folderUrl, async () => {
    console.log("describe 3");
    const response = await request(app).get(folderUrl);
    console.log(response.status);
    console.log("describe 4");

    // assert.ok(response.status === 200);
  });

  // it("test 5", async () => {
  //   await init();
  // });
};

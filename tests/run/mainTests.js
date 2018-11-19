import mongoose from "mongoose";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";
import * as srv from "../../src/server";
import { exec } from "child_process";
import { assert } from "chai";
import { Settings } from "../../config/common";

export default async () => {
  describe("entire tests", () => {
    beforeEach(async () => {
      await require("../db/testDbInit").init();
    });

    describe("mongoose models set of tests", () => mongooseTests.default());
    describe("web api tests", () => webApiTests.default());
    // describe("netcore bot service tests", () => {
    //   it("pinyin4net tests", done => {
    //     const processNetCore = exec(
    //       "dotnet test ./src/bot/chineseDuck.pinyin4net.tests/chineseDuck.pinyin4net.tests.csproj -c Release -f netcoreapp2.1"/* --TestRunParameters.apiAddress=" + Settings.getLocalApiAddress()*/
    //     );

    //     processNetCore.on("close", code => {
    //       console.log(`child process exited with code ${code}`);
    //       assert.ok(code == 0);
    //       done();
    //     });

    //     processNetCore.stdout.on("data", data => {
    //       console.log(data);
    //     });
    //   });
    // });

    afterEach(async () => {
      await require("../db/testDbInit").wipeCollections();
    });

    after(async () => {
      await srv.default.shutDown();
      await mongoose.disconnect();
    });
  });
};

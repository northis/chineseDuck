import mongoose from "mongoose";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";
import * as srv from "../../src/server";
import { exec } from "child_process";
import { assert } from "chai";
import mh from "../../src/server/api/db";

export default async () => {
  describe("entire tests", () => {
    beforeEach(async () => {
      await require("../db/testDbInit").init();
    });

    describe("mongoose models set of tests", () => mongooseTests.default());
    describe("web api tests", () => webApiTests.default());
    describe("netcore bot service tests", () => {
      it("main bot tests", done => {
        mh.word.remove({}).then(() => {
          const processNetCore = exec(
            "dotnet test ./src/bot/chineseDuck.Bot.Tests/chineseDuck.Bot.Tests.csproj -c Release -f netcoreapp2.1 && exit"
          );

          processNetCore.on("close", code => {
            console.log(`child process exited with code ${code}`);
            assert.ok(code == 0);
            done();
          });

          processNetCore.stdout.on("data", data => {
            console.log(data);
          });
        });
      });
    });

    afterEach(async () => {
      await require("../db/testDbInit").wipeCollections();
    });

    after(async () => {
      await srv.default.shutDown();
      await mongoose.disconnect();
    });
  });
};

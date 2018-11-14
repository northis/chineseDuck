import mongoose from "mongoose";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";
import * as srv from "../../src/server";
import { execSync } from "child_process";
import { Settings } from "../../config/common";

export default async () => {
  describe("entire tests", () => {
    before(async () => {
      await require("../db/testDbInit").init();
    });

    describe("mongoose models set of tests", () => mongooseTests.default());
    describe("web api tests", () => webApiTests.default());
    describe("netcore bot service tests", () => execSync("dotnet test ../../bot/chineseDuck.pinyin4net.tests/chineseDuck.pinyin4net.tests.cproj -c Release -f netcoreapp2.1 -apiAddress " + Settings.getLocalApiAddress()));

    after(async () => {
      await srv.default.shutDown();
      await mongoose.disconnect();
    });
  });
};

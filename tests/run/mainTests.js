import mongoose from "mongoose";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";
import * as srv from "../../src/server";

export default async () => {
  describe("entire tests", () => {
    before(async () => {
      await require("../db/testDbInit").init();
    });

    describe("mongoose models set of tests", () => mongooseTests.default());
    describe("web api tests", () => webApiTests.default());

    after(async () => {
      await srv.default.shutDown();
      await mongoose.disconnect();
    });
  });
};

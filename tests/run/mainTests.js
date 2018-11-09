import mongoose from "mongoose";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";
import * as srv from "../../src/server";

export default async () => {
  describe("entire tests", () => {
    before(async () => {
      console.log("before 1");
      console.log("before 2");
    });

    describe("mongoose models set of tests", () => mongooseTests.default());
    describe("web api tests", () => webApiTests.default());

    after(async () => {
      console.log("after 1");
      await srv.default.shutDown();
      await mongoose.disconnect();
      console.log("after 2");
    });
  });

}

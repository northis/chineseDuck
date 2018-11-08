import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { Settings } from "../../config/common";
import { init } from "../db/testDbInit";
import * as mongooseTests from "./mongooseTests";
import * as webApiTests from "./webApiTests";

let mongoServer = new MongodbMemoryServer();
let app = null;
let shutDown = null;
let modelsHolder = null;

describe("entire tests", () => {
  before(async () => {
    console.log("before 1");
    const mongoUri = await mongoServer.getConnectionString();

    Settings.mongoDbString = mongoUri;

    modelsHolder = require("../../src/server/api/db/index").mh;
    let def = require("../../src/server/index").default;
    app = def.app;
    shutDown = def.shutDown;
    console.log("before 2");
  });

  // webApiTests.default(app);

  describe("mongoose models set of tests", () => mongooseTests.default());

  // describe("web api tests", () => {
  // });

  after(async () => {
    console.log("after 1");
    await shutDown();
    await mongoose.disconnect();
    console.log("after 2");
  });
});

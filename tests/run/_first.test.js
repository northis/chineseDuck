import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { Settings } from "../../config/common";
import { init } from "../db/testDbInit";

let mongoServer = new MongodbMemoryServer();
let app = null;
let shutDown = null;
let modelsHolder = null;

before(async () => {
  const mongoUri = await mongoServer.getConnectionString();

  Settings.mongoDbString = mongoUri;

  modelsHolder = require("../../src/server/api/db/index").mh;
  let def = require("../../src/server/index").default;
  app = def.app;
  shutDown = def.shutDown;

});

after(async () => {
  await shutDown();
  await mongoose.disconnect();
});

export const getExpressApp = () => {
  return app;
};
export const getModelsHolder = () => {
  return modelsHolder;
};

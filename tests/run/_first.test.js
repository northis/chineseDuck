import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { Settings } from "../../config/common";
const log = require("why-is-node-running"); // should be your first require

let mongoServer = new MongodbMemoryServer();
let app = null;
let shutDown = null;
let modelsHolder = null;

before(done => {
  mongoServer.getConnectionString().then(mongoUri => {
    // console.log(
    //   "common mongoDbString - " +
    //     Settings.mongoDbString +
    //     " will be replaced with a test one " +
    //     mongoUri
    // );

    Settings.mongoDbString = mongoUri;
    modelsHolder = require("../../src/server/api/db/index").mh;
    let def = require("../../src/server/index").default;
    app = def.app;
    shutDown = def.shutDown;
    done();
  });
});

after(() => {
  shutDown();
  mongoServer.stop();
  setTimeout(() => {
    log();
  }, 5000);
});

export const getExpressApp = () => {
  return app;
};
export const getModelsHolder = () => {
  return modelsHolder;
};

import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { Settings } from "../../config/common";
import { init } from "../db/testDbInit";

let mongoServer = new MongodbMemoryServer();
let app = null;
let shutDown = null;
let modelsHolder = null;

before(done => {
  mongoServer.getConnectionString().then(mongoUri => {
    Settings.mongoDbString = mongoUri;

    modelsHolder = require("../../src/server/api/db/index").mh;
    let def = require("../../src/server/index").default;
    app = def.app;
    shutDown = def.shutDown;

    init(modelsHolder).then(() => done());
    // done();
  });
});

after(done => {
  shutDown()
    .then(() => mongoose.disconnect())
    .then(() => done());
});

export const getExpressApp = () => {
  return app;
};
export const getModelsHolder = () => {
  return modelsHolder;
};

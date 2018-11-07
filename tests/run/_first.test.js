import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import { Settings } from "../../config/common";

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

    testInserts();
    done();
  });
});

function testInserts() {}

after(done => {
  shutDown()
    .then(() => mongoose.disconnect())
    .then(() => mongoServer.stop())
    .then(() => done());
});

export const getExpressApp = () => {
  return app;
};
export const getModelsHolder = () => {
  return modelsHolder;
};

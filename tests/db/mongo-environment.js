import NodeEnvironment from "jest-environment-node";

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    console.info("Setup MongoDB Test Environment");

    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;

    await super.setup();
  }

  async teardown() {
    console.info("Teardown MongoDB Test Environment");

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

export default MongoEnvironment;

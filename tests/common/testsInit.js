import MongodbMemoryServer from "mongodb-memory-server";
import { Settings } from "../../config/common";

let mongoServer = new MongodbMemoryServer();

export default async () => {
  const mongoUri = await mongoServer.getConnectionString();
  Settings.mongoDbString = mongoUri;
};

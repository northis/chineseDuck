import MongodbMemoryServer from "mongodb-memory-server";
import { Settings } from "../../config/common";

let mongoServer = new MongodbMemoryServer();

export default async () => {
    console.log("async 1");
    const mongoUri = await mongoServer.getConnectionString();

    Settings.mongoDbString = mongoUri;
    console.log("async 2");
}
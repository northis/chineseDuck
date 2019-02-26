import { ModelsHolder } from "./modelsHolder";
import { Settings, isTest } from "../../../../config/common";
import mongoose from "mongoose";

console.log(Settings.mongoDbString);

mongoose.connect(Settings.mongoDbString, { useNewUrlParser: true });

if (mongoose.connection._eventsCount == 0) {
  mongoose.connection.on("connected", () => {
    console.info(
      "Mongoose default connection open to " + Settings.mongoDbString
    );
  });
  mongoose.connection.on("error", err => {
    console.info("Mongoose default connection error: " + err);
  });
  mongoose.connection.on("disconnected", () => {
    console.info("Mongoose default connection disconnected");
  });
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.info(
        "Mongoose default connection disconnected through app termination"
      );
    });
  });
}
const modelsHolder = new ModelsHolder();
modelsHolder.init();

export const mh = modelsHolder;
export const defaultFolderId = 0;
export default modelsHolder;

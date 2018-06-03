import { connect, connection, model } from "mongoose";
import { databaseUrl } from "../../config";
import { userSchema, folderSchema, wordFileSchema, wordSchema } from "./models";

connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function() {
  console.info("connected!");
});
const connectItem = connect(databaseUrl, { keepAlive: 120 });

const Users = model("users", userSchema);
const Folders = model("folders", folderSchema);
const WordFiles = model("wordFiles", wordFileSchema);
const Words = model("words", wordSchema);

export default { Users, Folders, WordFiles, Words, connectItem  };

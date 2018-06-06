import mongoose from "mongoose";
import autoIncrement from "mongoose-plugin-autoinc";
import {
  userSchema,
  folderSchema,
  wordFileSchema,
  wordSchema,
  CollectionsEnum,
  ModelsEnum
} from "./models";

export class ModelsHolder {
  constructor() {}

  init() {
    const userSchemaObj = new mongoose.Schema(userSchema);
    const folderSchemaObj = new mongoose.Schema(folderSchema);
    const wordSchemaObj = new mongoose.Schema(wordSchema);

    userSchemaObj.plugin(autoIncrement, ModelsEnum.user);
    folderSchemaObj.plugin(autoIncrement, ModelsEnum.folder);
    wordSchemaObj.plugin(autoIncrement, ModelsEnum.word);

    delete mongoose.connection.models[ModelsEnum.user];
    delete mongoose.connection.models[ModelsEnum.folder];
    delete mongoose.connection.models[ModelsEnum.word];
    delete mongoose.connection.models[ModelsEnum.wordFile];

    this.user = mongoose.model(
      ModelsEnum.user,
      userSchemaObj,
      CollectionsEnum.users
    );
    this.folder = mongoose.model(
      ModelsEnum.folder,
      folderSchemaObj,
      CollectionsEnum.folders
    );
    this.word = mongoose.model(
      ModelsEnum.word,
      wordSchemaObj,
      CollectionsEnum.words
    );
    this.wordFile = mongoose.model(
      ModelsEnum.wordFile,
      new mongoose.Schema(wordFileSchema),
      CollectionsEnum.wordFiles
    );
  }

  user;
  folder;
  wordFile;
  word;
}

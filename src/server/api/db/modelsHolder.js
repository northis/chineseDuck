import mongoose from "mongoose";
import { DebugKeys } from "../../../../config/common";
import {
  userSchema,
  folderSchema,
  idIncrementSchema,
  wordFileInfoSchema,
  wordSchema,
  CollectionsEnum,
  ModelsEnum,
  sessionSchema
} from "./models";
import { isNullOrUndefined } from "util";

export class ModelsHolder {
  constructor() {}

  init() {
    const userSchemaObj = new mongoose.Schema(userSchema);
    const folderSchemaObj = new mongoose.Schema(folderSchema);
    const wordSchemaObj = new mongoose.Schema(wordSchema);

    delete mongoose.connection.models[ModelsEnum.user];
    delete mongoose.connection.models[ModelsEnum.folder];
    delete mongoose.connection.models[ModelsEnum.word];
    delete mongoose.connection.models[ModelsEnum.wordFile];
    delete mongoose.connection.models[ModelsEnum.session];
    delete mongoose.connection.models[ModelsEnum.idIncrement];

    let mh = this;
    wordSchemaObj.pre("validate", false, function(next) {
      var item = this;
      mh.idIncrement.findByIdAndUpdate(
        "wordid",
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
        function(err, counter) {
          if (err) {
            console.log(err);
          }

          const newId = counter.seq;
          item._id = newId;
          next();
        }
      );
    });
    userSchemaObj.pre("validate", false, function(next) {
      var item = this;
      if (!isNullOrUndefined(item._id)) {
        next();
        return;
      }

      mh.idIncrement.findByIdAndUpdate(
        "userid",
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
        function(err, counter) {
          if (err) {
            console.log(err);
          }

          const newId = counter.seq;
          item._id = newId;
          next();
        }
      );
    });

    folderSchemaObj.pre("validate", false, function(next) {
      var item = this;
      mh.idIncrement.findByIdAndUpdate(
        "folderid",
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
        function(err, counter) {
          if (err) {
            console.log(err);
          }

          const newId = counter.seq;
          item._id = newId;
          next();
        }
      );
    });

    folderSchemaObj.index({ owner_id: 1, name: "text" }, { unique: true });
    wordSchemaObj.index(
      { originalWord: "text", owner_id: 1 },
      { unique: true }
    );
    wordSchemaObj.index({ lastModified: -1 });
    wordSchemaObj.index({ folder_id: 1 });

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
    this.idIncrement = mongoose.model(
      ModelsEnum.idIncrement,
      idIncrementSchema,
      CollectionsEnum.idIncrement
    );
    this.wordFile = mongoose.model(
      ModelsEnum.wordFile,
      new mongoose.Schema(wordFileInfoSchema),
      CollectionsEnum.wordFiles
    );
    this.session = mongoose.model(
      ModelsEnum.session,
      new mongoose.Schema(sessionSchema),
      CollectionsEnum.sessions
    );
  }

  user;
  folder;
  wordFile;
  word;
  session;
  idIncrement;
}

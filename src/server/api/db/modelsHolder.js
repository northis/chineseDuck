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
        { $inc: { seq: 2 } },
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

    folderSchemaObj.index({ owner_id: 1, name: "text" }, { unique: true, name: "owner_id_1_name_text" });
    wordSchemaObj.index(
      { originalWord: "text", owner_id: 1, folder_id: 1 },
      { unique: true,name: "originalWord_text_owner_id_1_folder_id_1" }
    );
    wordSchemaObj.index({ lastModified: -1 }, {name: "lastModified_-1"});
    wordSchemaObj.index({ folder_id: 1 }, {name: "folder_id_1"});
    wordSchemaObj.index({ "full.id": 1 }, {name: "full_id"});
    wordSchemaObj.index({ "trans.id": 1 }, {name: "trans_id"});
    wordSchemaObj.index({ "pron.id": 1 }, {name: "pron_id"});
    wordSchemaObj.index({ "orig.id": 1 }, {name: "orig_id"});

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

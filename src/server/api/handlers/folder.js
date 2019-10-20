import { mh, defaultFolderId } from "../../../server/api/db";
// import JSONStream from "JSONStream";
import * as folderVal from "../../../shared/validation";
import * as errors from "../../errors";
import { Settings } from "../../../../config/common";
import { isNullOrUndefined, isArray, isNumber } from "util";

const catchUniqueName = (res, error) => {
  if (error.code == 11000)
    errors.e409(
      res,
      "A folder with that name already exists. Release you imagination and try again."
    );
  else errors.e500(res, error.message);
};

const createFolderByUser = async (req, res, idUser) => {
  const name = req.body.name;
  const wordsCount = req.body.wordsCount || 0;

  if (!folderVal.folder.name.regex.test(name)) {
    return errors.e400(res, "Bad folder name");
  }

  try {
    const folderDb = await mh.folder.create({
      name: name,
      owner_id: idUser,
      activityDate: new Date(),
      wordsCount: wordsCount
    });
    res.status(200).send(folderDb);
  } catch (e) {
    catchUniqueName(res, e);
  }
};

const getFoldersByUser = async (req, res, idUser) => {
  const result = await mh.folder
    .find({ owner_id: idUser }, { owner_id: false })
    .sort({ activityDate: -1 });

  const defWordsCount = await mh.word.count({
    owner_id: idUser,
    folder_id: defaultFolderId
  });

  const defWordsTheLastest = await mh.word
    .find({
      owner_id: idUser,
      folder_id: defaultFolderId
    })
    .sort({ createDate: -1 })
    .select("createDate")
    .limit(1);
  let defWordsDate = Date.now();

  if (defWordsTheLastest.length != 0)
    defWordsDate = defWordsTheLastest[0].createDate;

  const defaultFolder = {
    _id: defaultFolderId,
    wordsCount: defWordsCount,
    name: "Default",
    activityDate: defWordsDate
  };

  const resArray = [defaultFolder].concat(result);
  res.json(resArray);
  // .cursor()
  // .pipe(JSONStream.stringify())
  // .pipe(res.type("json"));
};

/**
 * Operations on /folder
 */
export const main = {
  /**
   * summary: Create folder
   * description:
   * parameters: body
   * produces:
   * responses: 200, 409, 200
   */
  post: async function createFolder(req, res, next) {
    const idUser = req.session.passport.user;
    await createFolderByUser(req, res, idUser);
  },
  /**
   * summary: Get folders for current user
   * description:
   * produces: application/json
   * responses: 200
   */

  get: async function getFoldersForCurrentUser(req, res) {
    const idUser = req.session.passport.user;
    await getFoldersByUser(req, res, idUser);
  }
};

export const id = {
  /**
   * summary: Delete folder
   * description:
   * parameters: folderId
   * produces:
   * responses: 200, 404
   */
  delete: async function deleteFolder(req, res, next) {
    const folderId = req.params.folderId;
    const result = await mh.folder.deleteOne({ _id: folderId });

    if (result.n < 1) return errors.e404(res, "Folder is not found.");

    // TODO Yes, it should be wrapped by a transaction, but i am not sure it is really need to be here these days. May be i will add it in the future.
    await mh.word.deleteMany({ folder_id: folderId });
    res.status(200).send("Deleted");
  },
  /**
   * summary: Update folder (rename)
   * description:
   * parameters: folderId, body
   * produces:
   * responses: 200, 400, 409
   */ put: async function updateFolder(req, res, next) {
    var status = 200;
    const name = req.body.name;

    if (!folderVal.folder.name.regex.test(name)) {
      errors.e400(res, "Bad folder name");
      return;
    }

    const folderId = req.params.folderId;
    try {
      const result = await mh.folder.findOneAndUpdate(
        { _id: folderId },
        { name: req.body.name, activityDate: Date.now() },
        { new: true }
      );
      res.status(status).send(result);
    } catch (e) {
      catchUniqueName(res, e);
    }
  }
};

/**
 * Operations on /folder/user/{userId}
 */
export const user = {
  /**
   * summary: Create folder
   * description:
   * parameters: body
   * produces:
   * responses: 200, 409, 200
   */
  post: async function createFolder(req, res, next) {
    const idUser = req.params.userId;
    await createFolderByUser(req, res, idUser);
  },

  get: async function getFoldersForCurrentUser(req, res) {
    const idUser = req.params.userId;
    await getFoldersByUser(req, res, idUser);
  }
};

/**
 * Operations on /folder/template & /folder/template/user/{userId}
 */
export const template = {
  get: async function getTemplateFolders(req, res) {
    const folders = await mh.folder
      .find({ owner_id: Settings.serverUserId }, { owner_id: false })
      .sort({ name: 1 });
    res.json(folders);
  },
  post: async function addTemplateFolders(req, res, next) {
    const idUser = req.params.userId;
    const folderIds = req.body;

    if (
      isNullOrUndefined(folderIds) ||
      !isArray(folderIds) ||
      !folderIds.every(a => isNumber(a))
    ) {
      errors.e400(res);
      return;
    }

    const folders = [];
    for (const folderId of folderIds) {
      try {
        const folderTemplate = await mh.folder.findOne(
          { _id: folderId });

        if (isNullOrUndefined(folderTemplate)) {
          continue;
        }

        const folderDb = await mh.folder.create({
          name: folderTemplate.name,
          owner_id: idUser,
          activityDate: new Date(),
          wordsCount: folderTemplate.wordsCount
        });

        const words = await mh.word
          .find({ owner_id: Settings.serverUserId, folder_id: folderId })
          .sort({ name: 1 });

        for (const word of words) {
          word.folder_id = folderDb._id;
          word.owner_id = idUser;
          delete word._id;
          const clonedObject = JSON.parse(JSON.stringify(word));
          await mh.word.create(clonedObject);
        }
        folders.push(folderDb);
      } catch (e) {
        catchUniqueName(res, e);
      }
      res.status(200).send(folders);
    }
  }
};

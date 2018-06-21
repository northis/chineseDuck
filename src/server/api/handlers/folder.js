import mh from "../../../server/api/db";
// import JSONStream from "JSONStream";
import * as folderVal from "../../../shared/validation";

const catchUniqueName = (res, error) => {
  if (error.code == 11000)
    res
      .status(409)
      .send(
        "A folder with that name already exists. Release you imagination and try again."
      );
  else res.status(500).send(error.message);
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
   * responses: 201, 409, 200
   */
  post: async function createFolder(req, res, next) {
    const status = 201;
    const name = req.body.name;
    const idUser = req.session.passport.user;

    if (!folderVal.folder.name.regex.test(name)) {
      res.status(400).send("Bad folder name");
      return;
    }

    try {
      const result = new mh.folder({
        name: name,
        owner_id: idUser
      });
      await result.save();
      res.status(status).send(result);
    } catch (e) {
      catchUniqueName(res, e);
    }
  },
  /**
   * summary: Get folders for current user
   * description:
   * produces: application/json
   * responses: 200
   */ get: async function getFoldersForCurrentUser(req, res) {
    const idUser = req.session.passport.user;
    const result = await mh.folder
      .find({ owner_id: idUser }, { owner_id: false })
      .sort({ activityDate: -1 });

    res.json(result);
    // .cursor()
    // .pipe(JSONStream.stringify())
    // .pipe(res.type("json"));
  }
};

export const id = {
  /**
   * summary: Delete folder
   * description:
   * parameters: folderId
   * produces:
   * responses: 204
   */
  delete: async function deleteFolder(req, res, next) {
    var status = 200;
    const folderId = req.params.folderId;
    const result = await mh.folder.deleteOne({ _id: folderId });
    res.status(status).send(result);
  },
  /**
   * summary: Update folder (rename)
   * description:
   * parameters: folderId, body
   * produces:
   * responses: 200, 400, 409
   */

  put: async function updateFolder(req, res, next) {
    var status = 200;
    const name = req.body.name;

    if (!folderVal.folder.name.regex.test(name)) {
      res.status(400).send("Bad folder name");
      return;
    }

    const folderId = req.params.folderId;
    try {
      const result = await mh.folder.findOneAndUpdate(
        { _id: folderId },
        {
          name: req.body.name,
          activityDate: Date.now()
        },
        {
          new: true
        }
      );
      console.info(result);
      res.status(status).send(result);
    } catch (e) {
      catchUniqueName(res, e);
    }
  }
};

export const user = {
  /**
   * summary: Get folders for user
   * description:
   * parameters: userId
   * produces: application/json
   * responses: 400, 404, 200
   */
  get: function getFoldersForUser(req, res, next) {
    var status = 400;
    res.status(404);
  },
  id: {
    /**
     * summary: Get folders for user
     * description:
     * parameters: userId
     * produces: application/json
     * responses: 400, 404, 200
     */
    get: function getFoldersForUser(req, res, next) {
      var status = 400;
      res.status(404);
    }
  }
};

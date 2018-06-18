import * as errors from "../../errors";
import mh from "../../../server/api/db";
import JSONStream from "JSONStream";

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
  post: function createFolder(req, res, next) {
    var status = 201;
    res.status(404);
  },
  /**
   * summary: Get folders for current user
   * description:
   * produces: application/json
   * responses: 200
   */
  get: async function getFoldersForCurrentUser(req, res) {
    const idUser = req.session.passport.user;
    return await mh.folder
      .find({ owner_id: idUser }, { owner_id: false })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"));
  }
};

export const id = {
  /**
   * summary: Delete folder
   * description:
   * parameters: folderId
   * produces:
   * responses: 400, 404, 204
   */
  delete: async function deleteFolder(req, res, next) {
    var status = 204;

    var provider = dataProvider["delete"]["400"];
    provider(req, res, function(err, data) {
      if (err) {
        next(err);
        return;
      }
      res.status(status).send(data && data.responses);
    });
  },
  /**
   * summary: Update folder (rename)
   * description:
   * parameters: folderId, body
   * produces:
   * responses: 400, 404, 409
   */
  put: async function updateFolder(req, res, next) {
    /**
     * Get the data for response 400
     * For response `default` status 200 is used.
     */
    var status = 400;
    var provider = dataProvider["put"]["400"];
    provider(req, res, function(err, data) {
      if (err) {
        next(err);
        return;
      }
      res.status(status).send(data && data.responses);
    });
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

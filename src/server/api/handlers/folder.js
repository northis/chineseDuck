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
  get: async function getFoldersForCurrentUser(req, res, next) {
    const idUser = req.session.passport.user;
    await mh.folder
      .find({ owner_id: idUser }, { owner_id: false })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"));
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

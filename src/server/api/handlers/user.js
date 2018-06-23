import passport from "../../security/passport";
import * as errors from "../../errors";
import mh from "../../../server/api/db";
import { isNullOrUndefined } from "util";
import { sendCode, signIn } from "../../services/telegram";
import { RightEnum } from "../../../server/api/db/models";
/**
 * Operations on /user
 */
export const main = {
  /**
   * summary: Create user
   * description:
   * parameters: body
   * produces: application/json
   * responses: default
   */
  post: function createUser(req, res, next) {
    var status = 200;
    res.status(404);
  },
  /**
   * summary: Get user according to token in header
   * description:
   * parameters: token
   * produces: application/json
   * responses: 200, 404
   */
  get: async function getUserByToken(req, res, next) {
    var status = 200;

    const id = req.session.passport.user;

    const usr = await mh.user.findOne({ _id: id });
    if (isNullOrUndefined(usr)) return res.status(404).send("User not found");

    return res.status(status).send(
      JSON.stringify({
        id: usr._id,
        name: usr.username,
        who: usr.who,
        currentFolder_id: usr.currentFolder_id
      })
    );
  }
};
export const id = {
  /**
   * summary: Get user by user id
   * description:
   * parameters: id
   * produces: application/json
   * responses: 200, 404
   */
  get: function getUserById(req, res, next) {
    var status = 200;
    res.status(404);
  },
  /**
   * summary: Update user
   * description: This can only be done by the logged in user.
   * parameters: id, body
   * produces: application/json
   * responses: 400, 404
   */ put: function updateUser(req, res, next) {
    var status = 200;
    res.status(404);
  },
  /**
   * summary: Delete user
   * description: This can only be done by the logged in user.
   * parameters: id
   * produces: application/json
   * responses: 400, 404
   */ delete: function deleteUser(req, res, next) {
    var status = 200;
    res.status(404);
  }
};
/**
 * Operations on /user/login
 */
export const login = {
  /**
   * summary: Logs user into the system
   * description:
   * parameters: phone, code
   * produces: application/json
   * responses: 200, 400, 404
   */
  post: function loginUser(req, res, next) {
    const status = 200;

    passport.authenticate("local", (err, user) => {
      req.login(user, err => {
        if (err === undefined) {
          if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 90; // 90 days
          } else {
            req.session.cookie.maxAge = 1000 * 60 * 60; // 1 hour
          }

          return res
            .status(status)
            .send("You were authenticated & logged in!\n");
        } else {
          errors.e400(next, err);
        }
      });
    })(req, res, next);
  }
};

/**
 * Operations on /user/auth
 */
export const auth = {
  /**
   * summary: Send the auth code to user via sms
   * description:
   * parameters: body
   * produces: application/json
   * responses: 200, 400, 404
   */
  post: async function authUser(req, res, next) {
    if (
      !req.body.phone ||
      req.body.phone.length > 20 ||
      !req.body.phone.startsWith("+")
    ) {
      errors.e400(next);
      return;
    }

    const status = 200;
    let result = await sendCode(req.body.phone);

    if (result.phone_code_hash === "") {
      errors.e404(next);
    } else {
      return res
        .status(status)
        .send(JSON.stringify({ hash: result.phone_code_hash }));
    }
  }
};

/**
 * Operations on /user/logout
 */
export const logout = {
  /**
   * summary: Erase the user token, so user have to recreate it next time
   * description:
   * parameters:
   * produces: application/json
   * responses: 200
   */
  get: async function logoutUser(req, res) {
    const sessionId = req.sessionID;
    req.logOut();
    req.session.destroy(async () => {
      await mh.session.deleteOne({ _id: sessionId });
      res.redirect("/");
    });
  }
};

/**
 * Operations on /user/currentFolder/{folderId}
 */
export const currentfolder = {
  /**
   * summary: Set current folder for user
   * description:
   * parameters:
   * produces: application/json
   * responses: 201, 403
   */
  put: async function setFolder(req, res, next) {
    const status = 201;
    const folderId = req.params.folderId;
    const userId = req.session.passport.user;

    if (folderId !== 0 && req.user.who !== RightEnum.admin) {
      const folderItem = await mh.folder.findById(folderId);

      if (isNullOrUndefined(folderItem) || folderItem.owner_id != userId) {
        errors.e403(next);
        return;
      }
    }

    await mh.user.findOneAndUpdate(
      { _id: userId },
      { currentFolder_id: folderId }
    );
    return res.status(status).send("Updated");
  }
};

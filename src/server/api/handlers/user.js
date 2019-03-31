import passport from "../../security/passport";
import * as errors from "../../errors";
import mh from "../../../server/api/db";
import { isNullOrUndefined } from "util";

const catchUniqueName = (res, error) => {
  if (error.code == 11000)
    errors.e409(res, "A user with that id already exists.");
  else errors.e500(res, error.message);
};

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
  post: async function createUser(req, res, next) {
    const user = req.body;

    if (isNaN(user._id))
      return errors.e400(
        res,
        "You have to specify an id (_id field) for the user"
      );

    try {
      if (isNullOrUndefined(user.joinDate)) user.joinDate = new Date();

      user.currentFolder_id = 0;
      const userDb = await mh.user.create(user);

      res.status(200).send(userDb);
    } catch (e) {
      catchUniqueName(res, e);
    }
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
    if (isNullOrUndefined(usr)) return errors.e404(res, "User not found");

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
  get: async function getUserById(req, res, next) {
    const userId = req.params.userId;
    const userDb = await mh.user.findOne({ _id: userId });

    res.json(userDb);
  },

  /**
   * summary: Update user
   * description: This can only be done by the logged in user.
   * parameters: id, body
   * produces: application/json
   * responses: 400, 404
   */
  put: async function updateUser(req, res, next) {
    const user = req.body;
    const userId = req.params.userId;

    const result = await mh.user.updateOne(
      { _id: userId },
      {
        username: user.username,
        lastCommand: user.lastCommand,
        who: user.who,
        mode: user.mode,
        currentFolder_id: user.currentFolder_id
      }
    );

    res.status(200).send(result);
  },
  /**
   * summary: Delete user
   * description: This can only be done by the logged in user.
   * parameters: id
   * produces: application/json
   * responses: 400, 404
   */ delete: async function deleteUser(req, res, next) {
    const userId = req.params.userId;

    const result = await mh.user.deleteOne({ _id: userId });
    res.status(200).send(result);
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
  get: function loginUser(req, res, next) {
    req.body = req.query;
    passport.authenticate("local", (err, user) => {
      req.login(user, err => {
        if (!user) errors.e403(res);
        else if (err) errors.e400(res, err);
        else res.redirect("/");
      });
    })(req, res, next);
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
   * responses: 200, 403
   */
  put: async function setFolder(req, res, next) {
    const folderId = req.params.folderId;
    const userId = req.session.passport.user;

    await mh.user.findByIdAndUpdate(
      { _id: userId },
      { currentFolder_id: folderId }
    );
    return res.status(200).send("Updated");
  }
};

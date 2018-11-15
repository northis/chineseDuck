import { Router } from "express";
import * as errors from "../errors";
import * as user from "./handlers/user";
import * as word from "./handlers/word";
import * as folder from "./handlers/folder";
import * as rt from "../../shared/routes.gen";
import mh from "../../server/api/db";
import { RightWeightEnum, RightEnum } from "../../server/api/db/models";
import { isNullOrUndefined } from "util";

const routes = rt.default;
const privateRoutesFilter = /^(?!.*(^\/user\/auth|^\/user\/login)).*$/g;

var router = Router();

router.route(routes._user_auth.value).post(user.auth.post);
router.route(routes._user_login.value).post(user.login.post);
router.route(routes._user_logout.express).get(user.logout.get);

router.use(privateRoutesFilter, (req, res, next) => {
  if (!req.isAuthenticated()) {
    return errors.e401(res, "You have not rights to open it. Authorize, please.");
  }
  next();
});
const accessControl = path => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return errors.e401(res, "You have not rights to open it. Authorize, please.");
  }

  try {
    const method = req.method.toLowerCase();
    const role = req.user.who;
    const minRouteWeight = Math.min(
      path.actions[method].map(a => RightWeightEnum[a])
    );
    const roleWeight = RightWeightEnum[role];

    if (roleWeight < minRouteWeight) {
      errors.e403(res);
    } else {
      next();
    }
  } catch (e) {
    errors.e403(res, e);
  }
};

const folderControl = async (req, res, next) => {
  const role = req.user.who;
  const folderId = req.params.folderId;

  if (folderId == 0) {
    return next();
  }
  const folder = await mh.folder.findOne({ _id: folderId });

  if (isNullOrUndefined(folder)) {
    return errors.e404(res, "The folder is not found");
  }

  if (role == RightEnum.admin) {
    return next();
  }

  const idUser = req.session.passport.user;

  if (idUser == folder.owner_id) {
    return next();
  } else {
    return errors.e403(res, "It is not your folder");
  }
};

const wordControl = async (req, res, next) => {
  const role = req.user.who;
  const wordId = req.params.wordId;

  if (!wordId) {
    return errors.e400(next);
  }
  const word = await mh.word.findOne({ _id: wordId });

  if (isNullOrUndefined(word)) {
    return errors.e404(res, "The word is not found");
  }

  if (role == RightEnum.admin) {
    return next();
  }

  const idUser = req.session.passport.user;

  if (idUser == word.owner_id) {
    return next();
  } else {
    return errors.e403(res, "It is not your word");
  }
};

router
  .route(routes._user.express)
  .all(accessControl(routes._user))
  .get(user.main.get)
  .post(user.main.post);

router
  .route(routes._user_currentFolder__folderId_.express)
  .all(accessControl(routes._user_currentFolder__folderId_))
  .all(folderControl)
  .put(user.currentfolder.put);

router
  .route(routes._word_folder__folderId_.express)
  .all(accessControl(routes._word_folder__folderId_))
  .all(folderControl)
  .get(word.folderId.get)
  .put(word.folderId.put);

router
  .route(routes._folder.express)
  .all(accessControl(routes._folder))
  .get(folder.main.get)
  .post(folder.main.post);

router
  .route(routes._word_file__fileId_.express)
  .all(accessControl(routes._word_file__fileId_))
  .get(word.file.get);

router
  .route(routes._folder__folderId_.express)
  .all(accessControl(routes._folder__folderId_))
  .all(folderControl)
  .delete(folder.id.delete)
  .put(folder.id.put);

router
  .route(routes._word.express)
  .all(accessControl(routes._word))
  .post(word.main.post)
  //.all(wordControl)
  .put(word.main.put);

export default router;

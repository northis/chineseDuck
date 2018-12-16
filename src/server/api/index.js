import { Router } from "express";
import * as errors from "../errors";
import * as user from "./handlers/user";
import * as service from "./handlers/service";
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
router.route(routes._service_datetime.express).get(service.main.get);

router
  .route(routes._word_file__fileId_.express)
  // .all(accessControl(routes._word_file__fileId_))
  .get(word.file.get);

router.use(privateRoutesFilter, (req, res, next) => {
  if (!req.isAuthenticated()) {
    return errors.e401(
      res,
      "You have not rights to open it. Authorize, please."
    );
  }
  next();
});
const accessControl = path => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return errors.e401(
      res,
      "You have not rights to open it. Authorize, please."
    );
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

  if (isNaN(folderId)) {
    return errors.e400(res, "Invalid ID supplied");
  }

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

  if (isNaN(wordId)) {
    return errors.e400(res, "Invalid ID supplied");
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

const userControl = async (req, res, next) => {
  const role = req.user.who;
  const userId = req.params.userId;

  if (isNaN(userId)) {
    return errors.e400(res, "Invalid ID supplied");
  }
  const user = await mh.user.findOne({ _id: userId });

  if (isNullOrUndefined(user)) {
    return errors.e404(res, "The user is not found");
  }

  if (role == RightEnum.admin) {
    return next();
  }

  const idUser = req.session.passport.user;

  if (idUser === user._id) {
    return next();
  } else {
    return errors.e403(res, "Wrong user id");
  }
};

router
  .route(routes._user.express)
  .all(accessControl(routes._user))
  .get(user.main.get)
  .post(user.main.post);

router
  .route(routes._user__userId_.express)
  .all(accessControl(routes._user__userId_))
  .all(userControl)
  .get(user.id.get)
  .put(user.id.put)
  .delete(user.id.delete);

router
  .route(routes._user_currentFolder__folderId_.express)
  .all(accessControl(routes._user_currentFolder__folderId_))
  .all(folderControl)
  .put(user.currentfolder.put);

router
  .route(routes._word_folder__folderId_.express)
  .all(accessControl(routes._word_folder__folderId_))
  .all(folderControl)
  .put(word.folderId.put);

router
  .route(routes._word_folder__folderId__count__count_.express)
  .all(accessControl(routes._word_folder__folderId__count__count_))
  .all(folderControl)
  .get(word.folderId.get);

router
  .route(routes._folder.express)
  .all(accessControl(routes._folder))
  .get(folder.main.get)
  .post(folder.main.post);

router
  .route(routes._folder_user__userId_.express)
  .all(accessControl(routes._folder_user__userId_))
  .all(userControl)
  .get(folder.user.get)
  .post(folder.user.post);

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
  .put(word.main.put);

router
  .route(routes._word__wordId__rename.express)
  .all(accessControl(routes._word__wordId__rename))
  .all(wordControl)
  .put(word.rename.put);

router
  .route(routes._word_file.express)
  .all(accessControl(routes._word_file))
  .post(word.file.post);

router
  .route(routes._word__wordId__score.express)
  .all(accessControl(routes._word__wordId__score))
  .all(wordControl)
  .put(word.score.put);

router
  .route(routes._word__wordId_.express)
  .all(accessControl(routes._word__wordId_))
  .all(wordControl)
  .get(word.wordId.get)
  .delete(word.wordId.delete);

router
  .route(routes._word_user__userId__search__wordEntry_.express)
  .all(accessControl(routes._word_user__userId__search__wordEntry_))
  .all(userControl)
  .get(word.search.get);

router
  .route(routes._word_file__fileId_.express)
  .all(accessControl(routes._word_file__fileId_))
  .delete(word.file.delete);

export default router;

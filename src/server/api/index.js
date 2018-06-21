import { Router } from "express";
import * as errors from "../errors";
import * as user from "./handlers/user";
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

router.use(privateRoutesFilter, (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
});
const accessControl = path => (req, res, next) => {
  try {
    const method = req.method.toLowerCase();
    const role = req.user.who;
    const minRouteWeight = Math.min(
      path.actions[method].map(a => RightWeightEnum[a])
    );
    const roleWeight = RightWeightEnum[role];

    if (roleWeight < minRouteWeight) {
      errors.e403(next);
    } else {
      next();
    }
  } catch (e) {
    errors.e403(next, e);
  }
};

const folderControl = async (req, res, next) => {
  const role = req.user.who;
  const folderId = req.params.folderId;
  const folder = await mh.folder.findOne({ _id: folderId });

  if (isNullOrUndefined(folder)) {
    return errors.e404(next, new Error("The folder is not found"));
  }

  if (role == RightEnum.admin) {
    return next();
  }

  const idUser = req.session.passport.user;

  if (idUser == folder.owner_id) {
    next();
  } else {
    return errors.e403(next, new Error("It is not your folder"));
  }
};

router
  .route(routes._user.express)
  .all(accessControl(routes._user))
  .get(user.main.get)
  .post(user.main.post);

router
  .route(routes._folder.express)
  .all(accessControl(routes._folder))
  .get(folder.main.get)
  .post(folder.main.post);

router
  .route(routes._folder__folderId_.express)
  .all(accessControl(routes._folder__folderId_))
  .all(folderControl)
  .delete(folder.id.delete)
  .put(folder.id.put);

router.route(routes._user_logout.value).get(user.logout.get);

// define the home page route
router.get("/", function(req, res) {
  res.send("Birds home page1");
});
export default router;

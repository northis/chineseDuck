import { Router } from "express";
import * as errors from "../errors";
import * as user from "./handlers/user";
import * as folder from "./handlers/folder";
import * as rt from "../../shared/routes.gen";
import { RightWeightEnum } from "../../server/api/db/models";

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

    if (roleWeight < minRouteWeight) errors.e403(next);
    else next();
  } catch (e) {
    errors.e403(next, e);
  }
};

router
  .route(routes._user.value)
  .all(accessControl(routes._user))
  .get(user.main.get)
  .post(user.main.post);

router
  .route(routes._folder.value)
  .all(accessControl(routes._folder))
  .get(folder.main.get)
  .post(folder.main.post)
  .delete(folder.id.delete);

// router
//   .route(routes._service_datetime.value)
//   .all(access(routes._service_datetime))
//   .get(user.main.get);

router.route(routes._user_logout.value).get(user.logout.get);

// define the home page route
router.get("/", function(req, res) {
  res.send("Birds home page1");
});
export default router;

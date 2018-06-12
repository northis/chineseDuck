import { Router } from "express";
import * as user from "./handlers/user";
import * as rt from "../../shared/routes.gen";

const routes = rt.default;
var router = Router();

router.route(routes._user_auth.value).post(user.auth.post);
router.route(routes._user_login.value).post(user.login.post);

router.use(/^(?!.*(^\/user\/auth|^\/user\/login)).*$/g, (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
});

router
  .route(routes._user.value)
  .get(user.main.get)
  .post(user.main.post);

router.route(routes._user_logout.value).get(user.logout.get);

// define the home page route
router.get("/", function(req, res) {
  res.send("Birds home page1");
});
export default router;

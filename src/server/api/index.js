import { Router } from "express";
import * as user from "./handlers/user";
import auth from "./handlers/user/auth";
import login from "./handlers/user/login";
import logout from "./handlers/user/logout";
import * as rt from "../../shared/routes.gen";

var router = Router();

router.route(rt.default._user_auth).post(auth.post);
router.route(rt.default._user_login).post(login.post);
router.use((req, res, next) => {
  console.info("=");
  if (req.isAuthenticated()) {
    console.info("+");
    return next();
  }
  console.info("-");
  res.redirect("/");
});

router
  .route("/user")
  .post(user.post)
  .get(user.get);

router.route(rt.default._user_logout).get(logout.get);

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.info("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", function(req, res) {
  res.send("Birds home page1");
});
export default router;

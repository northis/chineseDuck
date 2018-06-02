import { Router } from "express";
import * as user from "./handlers/user";
import auth from "./handlers/user/auth";
import login from "./handlers/user/login";

// import * as errors from '../errors';
// import config from '../config';
//import jwt from 'express-jwt';
var router = Router();

router
  .route("/user")
  .post(user.post)
  .get(user.get);

router.route("/user/auth").post(auth.post);
router.route("/user/login").post(login.post);

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

import { Router } from "express";
import * as errors from '../errors';
import config from '../config';
import jwt from 'express-jwt';
var router = Router();

// router.use(
//   jwt({
//     secret: config.auth.jwt.secret,
//     credentialsRequired: true,
//     getToken: req => req.cookies.id_token,
//   }),
//   function (req, res, next) {
//     if (!req.user) return errors.e401(next);
    
//   }
// );
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.info('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page0');
});

export default router;

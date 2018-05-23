import { Router } from "express";
var router = Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.info('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});

export default router;

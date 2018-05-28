import { Router } from "express";

// var fs = require('fs'),
//   path = require('path');
// var jsyaml = require('js-yaml');
// var SwaggerExpress = require('swagger-express-mw');
// var SwaggerTools = require('swagger-tools');
// var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
// import { isDebug } from '../../../config/common';
// // import * as errors from '../errors';
// // import config from '../config';
// //import jwt from 'express-jwt';
 var router = Router();
// var config = {
//   appRoot: __dirname, // required config
//   swaggerUi: path.join(__dirname, 'swagger.json'),
//   //controllers: path.join(__dirname, './controllers'),
//   useStubs: isDebug() // Conditionally turn on stubs (mock mode)
// };

// // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
// var spec = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
// var swaggerDoc = jsyaml.safeLoad(spec);


// // Initialize the Swagger middleware
// SwaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

//   // Serve the Swagger documents and Swagger UI
//   router.use(middleware.swaggerUi());


// });



// SwaggerExpress.create(config, function (err, swaggerExpress) {
//   if (err) { throw err; }
//   router.use(SwaggerUi(swaggerExpress.runner.swagger));
//   // install middleware
//   swaggerExpress.register(router);


// });
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
router.get('/', function (req, res) {
  res.send('Birds home page1');
});
export default router;


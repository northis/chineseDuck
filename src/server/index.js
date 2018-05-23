import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
//import jwt from 'jsonwebtoken';
import PrettyError from 'pretty-error';
//import passport from './passport';
//import router from './router';
import config from './config';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Register Node.js middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

// Authentication
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

//app.use(passport.initialize());

// app.get(
//   '/login/facebook',
//   passport.authenticate('facebook', {
//     scope: ['email', 'user_location'],
//     session: false,
//   }),
// );

// app.get(
//   '/login/facebook/return',
//   passport.authenticate('facebook', {
//     failureRedirect: '/login',
//     session: false,
//   }),
//   (req, res) => {
//     const expiresIn = 60 * 60 * 24 * 180; // 180 days
//     const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
//     res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
//     res.redirect('/');
//   },
// );

app.use("/client", express.static(path.join(__dirname, "/public")));
app.get('*', function(req, res) {
  res.redirect('/client');
});

//app.get("*", (req, res) => res.sendFile(HTML_FILE));

// // Register server-side rendering middleware
// app.get('/public', async (req, res, next) => {
//   try {
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept();
}

app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`);
});
export default app;
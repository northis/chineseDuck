import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import api from './api';
//import * as errors from './errors';
import config from './config';
import helmet from 'helmet';
import compression from 'compression';
import httpErrorPages from 'http-error-pages';
import pkg from '../../package.json';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use('/api/v1/', api);
app.use(express.static(path.join(__dirname, '/public')));


// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

httpErrorPages.express(app, {
  lang: 'en_US',
  footer: `<p>${pkg.description} - ${pkg.version} <a href=${pkg.url}>Contact me</a></p>`
});

// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

const listen = app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`);
});

// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./api');
}

export default { app, listen };
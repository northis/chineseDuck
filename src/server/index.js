import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import api from './api';
//import * as errors from './errors';
import config from './config';
import helmet from 'helmet';
import compression from 'compression';
import httpErrorPages from 'http-error-pages';
import { getFooterMarkupLine } from '../../config/common.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api/swagger.json';
import passport from './security/passport';
import sessionItem from './security/session';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use(sessionItem);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/', api);
app.use(express.static(path.join(__dirname, '/public')));

app.get(/^\/client/, function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.get('/', function (request, response) {
  response.redirect('/client');
});

httpErrorPages.express(app, {
  lang: 'en_US',
  footer: getFooterMarkupLine()
});

const listen = app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`);
});

// Hot Module Replacement
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./api');
}

export default { app, listen };
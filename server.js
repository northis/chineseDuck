import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import * as helpers from './config/helpers';
import path from 'path';

import apiRoutes from './src/api/routes/index';

const mode = helpers.getMode();
const isDevelopment = mode !== helpers.ModeEnum.Production;
const config = require(isDevelopment ? './config/webpack.dev.js' : './config/webpack.prod.js');

const app = express(),
  DIST_DIR = path.join(__dirname, "dist"),
  HTML_FILE = path.join(DIST_DIR, "index.html"),
  DEFAULT_PORT = 3000,
  compiler = webpack(config);

if (isDevelopment) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
  app.use(webpackDevMiddleware(compiler));

  app.get("*", (req, res, next) => {
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
}

else {
  app.use(express.static(DIST_DIR));
  app.get("*", (req, res) => res.sendFile(HTML_FILE));
}

app.listen(DEFAULT_PORT, function () {
  console.log('I am on port 3000.');
});
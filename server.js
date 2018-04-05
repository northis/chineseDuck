const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
var history = require('connect-history-api-fallback');
const helpers = require('./config/helpers');

const app = express();
app.use(history());

const mode = helpers.getMode();
const config = require(mode == helpers.ModeEnum.Production ? './config/webpack.prod.js' : './config/webpack.dev.js');

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.listen(3000, function () {
  console.log('I am on port 3000.');
});
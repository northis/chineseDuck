const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');

var indexModeArg = process.argv.indexOf('--mode');
if (indexModeArg != -1) {
  var mode = process.argv[indexModeArg + 1];
  config.mode = mode == undefined ? 'development' : mode;
}

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.listen(3000, function () {
  console.log('I am on port 3000.');
});
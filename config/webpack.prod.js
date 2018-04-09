const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  plugins: [
    new UglifyJSPlugin()
  ],
  optimization: {
      minimize: true
  }
});
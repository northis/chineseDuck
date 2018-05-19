const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
 devtool: 'source-map',
  devServer: {
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      historyApiFallback: true,
      hot: true,
      https: false,
      noInfo: true,
  },
  optimization: {
      minimize: false
  }
});
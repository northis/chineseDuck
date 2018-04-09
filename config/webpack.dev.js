const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');

module.exports = merge(common, {
 devtool: 'source-map',
  devServer: {
      proxy: {
          '/api': 'http://localhost:3000'
      },
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
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const webpack = require('webpack');
const helpers = require('./helpers');

const mode = helpers.getMode();

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'style.css',
    chunkFilename: "[id].css"
  }),
  new CleanWebpackPlugin(['dist'], {
    root: path.join(__dirname, '..')
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(mode)
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true
  }),
  new webpack.HotModuleReplacementPlugin(),
  new CopyWebpackPlugin([
    { from: './src/assets/favicon', to: './favicon/' },
    { from: './src/assets/favicon/favicon.ico', to: './favicon.ico' },
    helpers.getFontCopyPattern(),
    { from: './node_modules/jquery/dist/jquery.min.js', to: './jquery.min.js' },
  ]),
  new WriteFilePlugin()
];

export default plugins;
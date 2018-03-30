var path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

function getMode() {
  var indexModeArg = process.argv.indexOf('--mode');
  if (indexModeArg != -1) {
    var mode = process.argv[indexModeArg + 1];
    return mode == undefined ? 'development' : mode;
  }
}

function getFontCopyPattern() {
  if (getMode() === 'production')
    return { from: './src/assets/fonts', to: './fonts/' }
  else
    return { from: './src/assets/fonts/aleo-regular-webfont.ttf', to: './fonts/aleo-regular-webfont.ttf' }
}

module.exports = {
  mode: getMode(),
  entry: ['./src/index.ts', 'webpack-hot-middleware/client'],
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "css-loader"
      }, {
        loader: "less-loader"
      }],
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
      },
    },
    {
      test: /\.css$/,
      loaders: [
        'vue-style-loader',
        'css-loader'
      ],
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          ts: 'ts-loader'
        },
        esModule: true
      }
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
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
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: this.mode
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: './src/assets/favicon', to: './favicon/' },
      { from: './src/assets/favicon/favicon.ico', to: './favicon.ico' },
      getFontCopyPattern(),
    ]),
    new WriteFilePlugin(),
  ],
  performance: {
    hints: false
  },
  optimization: {
    minimize: true
  }
};
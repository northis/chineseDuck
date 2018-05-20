import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin  from'html-webpack-plugin';
import CopyWebpackPlugin  from'copy-webpack-plugin';
import WriteFilePlugin  from'write-file-webpack-plugin';
import MiniCssExtractPlugin  from"mini-css-extract-plugin";
import path from'path';

import webpack from'webpack';
import * as helpers from'./helpers';
import fs from 'fs';
import path from 'path';
import pkg from '../package.json';

const mode = helpers.getMode();

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');
const isDebug = mode !== helpers.ModeEnum.Production;
const isVerbose = process.argv.includes('--verbose');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');

const reScript = /\.(js|jsx|mjs)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = isDebug
  ? '[path][name].[ext]?[hash:8]'
  : '[hash:8].[ext]';


// CSS Nano options http://cssnano.co/
const minimizeCssOptions = {
    discardComments: { removeAll: true },
  };
  
  //
  // Common configuration chunk to be used for both
  // client-side (client.js) and server-side (server.js) bundles
  // -----------------------------------------------------------------------------
  
  const config = {
    context: ROOT_DIR,
    mode,  
    output: {
      path: resolvePath(BUILD_DIR, 'public/assets'),
      publicPath: '/assets/',
      pathinfo: isVerbose,
      filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
      chunkFilename: isDebug
        ? '[name].chunk.js'
        : '[name].[chunkhash:8].chunk.js',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
  
    resolve: {
      // Allow absolute paths in imports, e.g. import Button from 'components/Button'
      // Keep in sync with .flowconfig and .eslintrc
      modules: ['node_modules', 'src'],
    },
  
    module: {
      // Make missing exports an error instead of warning
      strictExportPresence: true,
  
      rules: [
        // Rules for JS / JSX
        {
          test: reScript,
          include: [SRC_DIR, resolvePath('tools')],
          loader: 'babel-loader',
          options: {
            // https://github.com/babel/babel-loader#options
            cacheDirectory: isDebug,
  
            // https://babeljs.io/docs/usage/options/
            babelrc: false,
            presets: [
              // A Babel preset that can automatically determine the Babel plugins and polyfills
              // https://github.com/babel/babel-preset-env
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: pkg.browserslist,
                    forceAllTransforms: !isDebug, // for UglifyJS
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              // Experimental ECMAScript proposals
              // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
              '@babel/preset-stage-2',
              // Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
              '@babel/preset-flow',
              // JSX
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              ['@babel/preset-react', { development: isDebug }],
            ],
            plugins: [
              // Treat React JSX elements as value types and hoist them to the highest scope
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
              ...(isDebug ? [] : ['@babel/transform-react-constant-elements']),
              // Replaces the React.createElement function with one that is more optimized for production
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
              ...(isDebug ? [] : ['@babel/transform-react-inline-elements']),
              // Remove unnecessary React propTypes from the production build
              // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
              ...(isDebug ? [] : ['transform-react-remove-prop-types']),
            ],
          },
        },
  
        // Rules for Style Sheets
        {
          test: reStyle,
          rules: [  
            // Process external/third-party styles
            {
              exclude: SRC_DIR,
              loader: 'css-loader',
              options: {
                sourceMap: isDebug,
                minimize: isDebug ? false : minimizeCssOptions,
              },
            },
  
            // Process internal/project styles (from src folder)
            {
              include: SRC_DIR,
              loader: 'css-loader',
              options: {
                // CSS Loader https://github.com/webpack/css-loader
                importLoaders: 1,
                sourceMap: isDebug,
                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                localIdentName: isDebug
                  ? '[name]-[local]-[hash:base64:5]'
                  : '[hash:base64:5]',
                // CSS Nano http://cssnano.co/
                minimize: isDebug ? false : minimizeCssOptions,
              },
            },
  
            // Apply PostCSS plugins including autoprefixer
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './tools/postcss.config.js',
                },
              },
            },
  
            // Compile Less to CSS
            // https://github.com/webpack-contrib/less-loader
            // Install dependencies before uncommenting: yarn add --dev less-loader less
            // {
            //   test: /\.less$/,
            //   loader: 'less-loader',
            // },
  
            // Compile Sass to CSS
            // https://github.com/webpack-contrib/sass-loader
            // Install dependencies before uncommenting: yarn add --dev sass-loader node-sass
            // {
            //   test: /\.(scss|sass)$/,
            //   loader: 'sass-loader',
            // },
          ],
        },
  
        // Rules for images
        {
          test: reImage,
          oneOf: [
            // Inline lightweight images into CSS
            {
              issuer: reStyle,
              oneOf: [
                // Inline lightweight SVGs as UTF-8 encoded DataUrl string
                {
                  test: /\.svg$/,
                  loader: 'svg-url-loader',
                  options: {
                    name: staticAssetName,
                    limit: 4096, // 4kb
                  },
                },
  
                // Inline lightweight images as Base64 encoded DataUrl string
                {
                  loader: 'url-loader',
                  options: {
                    name: staticAssetName,
                    limit: 4096, // 4kb
                  },
                },
              ],
            },
  
            // Or return public URL to image resource
            {
              loader: 'file-loader',
              options: {
                name: staticAssetName,
              },
            },
          ],
        },
  
        // Convert plain text into JS module
        {
          test: /\.txt$/,
          loader: 'raw-loader',
        },
  
        // Convert Markdown into HTML
        {
          test: /\.md$/,
          loader: path.resolve(__dirname, './lib/markdown-loader.js'),
        },
  
        // Return public URL for all assets unless explicitly excluded
        // DO NOT FORGET to update `exclude` list when you adding a new loader
        {
          exclude: [reScript, reStyle, reImage, /\.json$/, /\.txt$/, /\.md$/],
          loader: 'file-loader',
          options: {
            name: staticAssetName,
          },
        },
  
        // Exclude dev modules from production build
        ...(isDebug
          ? []
          : [
              {
                test: resolvePath(
                  'node_modules/react-deep-force-update/lib/index.js',
                ),
                loader: 'null-loader',
              },
            ]),
      ],
    },
  
    // Don't attempt to continue if there are any errors.
    bail: !isDebug,
  
    cache: isDebug,
  
    // Specify what bundle information gets displayed
    // https://webpack.js.org/configuration/stats/
    stats: {
      cached: isVerbose,
      cachedAssets: isVerbose,
      chunks: isVerbose,
      chunkModules: isVerbose,
      colors: true,
      hash: isVerbose,
      modules: isVerbose,
      reasons: isDebug,
      timings: true,
      version: isVerbose,
    },
  
    // Choose a developer tool to enhance debugging
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
  };
  

module.exports = {
    mode: helpers.getMode(),
    entry: ['./src/index.ts', 'webpack-hot-middleware/client'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/site',
        filename: '[name].js',
    },
    module: {
        rules: [
        {
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: () => {
                        [
                            require('precss'),
                            require('autoprefixer')
                        ]
                    }
                }
            }, {
                loader: 'sass-loader'
            }]
        },
        {
            test: /\.css$/,
            loaders: [
                MiniCssExtractPlugin.loader,
                'vue-style-loader',
                'css-loader'
            ],
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    ts: 'ts-loader',
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
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
            test: reImage,
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
    plugins: [
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
        new CopyWebpackPlugin([
            { from: './src/assets/favicon', to: './favicon/' },
            { from: './src/assets/favicon/favicon.ico', to: './favicon.ico' },
            helpers.getFontCopyPattern(),
            { from: './node_modules/jquery/dist/jquery.min.js', to: './jquery.min.js' },
        ]),
        new WriteFilePlugin()
    ],
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
            }
        }
    },
    externals: {
        jquery: 'jQuery'
    }
};
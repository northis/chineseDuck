import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import nodeExternals from 'webpack-node-externals';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';

import webpack from 'webpack';
import * as common from './common';
import * as helpers from './helpers';
import pkg from '../package.json';

const mode = common.getMode();

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');
const CLIENT_DIR = resolvePath(BUILD_DIR, 'public');
const isDebug = common.isDebug();
const isVerbose = common.isVerbose();
const isAnalyze = common.isAnalyze();

const reScript = /\.(js)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = isDebug
    ? '[path][name].[ext]?[hash:8]'
    : '[hash:8].[ext]';

const minimizeCssOptions = {
    discardComments: { removeAll: true },
};

// Common configuration chunk 
const config = {
    context: ROOT_DIR,
    mode,
    output: {
        path: CLIENT_DIR,
        publicPath: '/client/',
        pathinfo: isVerbose,
        filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: isDebug
            ? '[name].chunk.js'
            : '[name].[chunkhash:8].chunk.js',
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },

    resolve: {
        modules: ['node_modules', 'src'],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    module: {
        strictExportPresence: true,
        rules:
            [
                {
                    test: reScript,
                    loader: 'babel-loader',
                    include: [SRC_DIR, resolvePath('config')],
                    exclude: /node_modules/,
                    options: {
                        cacheDirectory: isDebug,
                        babelrc: false,
                        presets: [
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
                        ]
                    },
                },
            ]
    },

    bail: !isDebug,
    cache: isDebug,
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

    devtool: 'source-map',
};

// client-side bundle
const clientConfig = {
    ...config,

    name: 'client',
    target: 'web',

    entry: ['webpack-hot-middleware/client', './src/index.ts'],
    module: {
        ...config.module,

        rules: [
            ...config.module.rules,
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                },
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        sourceMap: isDebug,
                        modules: true,
                        localIdentName: isDebug
                            ? '[name]-[local]-[hash:base64:5]'
                            : '[hash:base64:5]',
                        minimize: isDebug ? false : minimizeCssOptions,
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
                oneOf: [
                    {
                        issuer: reStyle,
                        oneOf: [
                            {
                                test: /\.svg$/,
                                loader: 'svg-url-loader',
                                options: {
                                    name: staticAssetName,
                                    limit: 4096, // 4kb
                                },
                            },
                            {
                                loader: 'url-loader',
                                options: {
                                    name: staticAssetName,
                                    limit: 4096, // 4kb
                                },
                            },
                        ],
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: staticAssetName,
                        },
                    },
                ],
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
        ...config.plugins,
        new webpack.DefinePlugin({
            'process.env.BROWSER': true,
            'process.env.NODE_ENV': JSON.stringify(mode),
            __DEV__: isDebug,
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            hash: true
        }),
        new CopyWebpackPlugin([
            { from: './src/assets/favicon', to: './favicon/' },
            { from: './src/assets/favicon/favicon.ico', to: './favicon.ico' },
            helpers.getFontCopyPattern(),
            { from: './node_modules/jquery/dist/jquery.min.js', to: './jquery.min.js' },
        ]),
        new WriteFilePlugin(),

        ...(isDebug
            ? []
            : [
                ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
            ]),
    ],

    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
            }
        },
    },

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    performance: {
        hints: false
    },
    externals: {
        jquery: 'jQuery'
    }
};

// server-side bundle
const serverConfig = {
    ...config,

    name: 'server',
    target: 'node',

    entry: {
        server: ['@babel/polyfill/noConflict', './src/server'],
    },

    output: {
        ...config.output,
        path: BUILD_DIR,
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js',
    },

    // Webpack mutates resolve object, so clone it to avoid issues
    // https://github.com/webpack/webpack/issues/4817
    resolve: {
        ...config.resolve,
    },

    module: {
        ...config.module,

        rules: helpers.overrideRules(config.module.rules, rule => {
            // Override babel-preset-env configuration for Node.js
            if (rule.loader === 'babel-loader') {
                return {
                    ...rule,
                    options: {
                        ...rule.options,
                        presets: rule.options.presets.map(
                            preset =>
                                preset[0] !== '@babel/preset-env'
                                    ? preset
                                    : [
                                        '@babel/preset-env',
                                        {
                                            targets: {
                                                node: pkg.engines.node.match(/(\d+\.?)+/)[0],
                                            },
                                            modules: false,
                                            useBuiltIns: false,
                                            debug: false,
                                        },
                                    ],
                        ),
                    },
                };
            }

            if (
                rule.loader === 'file-loader' ||
                rule.loader === 'url-loader' ||
                rule.loader === 'svg-url-loader'
            ) {
                return {
                    ...rule,
                    options: {
                        ...rule.options,
                        emitFile: false,
                    },
                };
            }

            return rule;
        }),
    },

    // externals: [
    //   './chunk-manifest.json',
    //   './asset-manifest.json',
    //   nodeExternals({
    //     whitelist: [reStyle, reImage],
    //   }),
    // ],

    plugins: [
        ...config.plugins,
        new webpack.DefinePlugin({
            'process.env.BROWSER': false,
            'process.env.NODE_ENV': JSON.stringify(mode),
            __DEV__: isDebug,
        }),

        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
        }),
    ],
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },
    externals: [
        nodeExternals({
            whitelist: [reStyle, reImage],
        }),
    ],
};


//if (isDebug) {

    clientConfig.entry.client = ['./config/lib/webpackHotDevClient']
        .concat(clientConfig.entry.client)
        .sort((a, b) => b.includes('polyfill') - a.includes('polyfill'));
    clientConfig.output.filename = clientConfig.output.filename.replace(
        'chunkhash',
        'hash',
    );
    clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace(
        'chunkhash',
        'hash',
    );
    clientConfig.module.rules = clientConfig.module.rules.filter(
        x => x.loader !== 'null-loader',
    );

    serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
    serverConfig.output.hotUpdateChunkFilename =
        'updates/[id].[hash].hot-update.js';
    serverConfig.module.rules = serverConfig.module.rules.filter(
        x => x.loader !== 'null-loader',
    );
//}

export default [clientConfig, serverConfig];
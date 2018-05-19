import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin  from'html-webpack-plugin';
import CopyWebpackPlugin  from'copy-webpack-plugin';
import WriteFilePlugin  from'write-file-webpack-plugin';
import MiniCssExtractPlugin  from"mini-css-extract-plugin";
import path from'path';

import webpack from'webpack';
import helpers from'./helpers';
import fs from 'fs';
import path from 'path';
import pkg from '../package.json';

const mode = helpers.getMode();

module.exports = {
    mode: helpers.getMode(),
    entry: ['./src/index.ts', 'webpack-hot-middleware/client'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/site',
        filename: '[name].js',
    },
    module: {
        rules: [{
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
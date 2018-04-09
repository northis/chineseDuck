const webpack = require('webpack');
const path = require('path');
const helpers = require('./helpers');
const modules = require('./modules');
const plugins = require('./plugins');

module.exports = {
    mode: helpers.getMode(),
    entry: [ './src/index.ts','webpack-hot-middleware/client'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: modules.default,
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            vue: 'vue/dist/vue.js'
        },
    },
    plugins: plugins.default,
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
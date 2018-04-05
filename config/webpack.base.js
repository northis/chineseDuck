const path = require('path');
const webpack = require('webpack');

const helpers = require('./helpers');
const modules = require('./modules');
const plugins = require('./plugins');

module.exports = {
    mode: helpers.getMode(),
    entry: ['./src/index.ts', 'webpack-hot-middleware/client'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'build.[hash].js',
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
        minimize: true
    }
};
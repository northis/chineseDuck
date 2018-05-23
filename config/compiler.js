import webpack from 'webpack';
import webpackConfig from './webpack.config';

const compiler = webpack(webpackConfig);

export default compiler;
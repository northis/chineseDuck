const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const moduleItem = {
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
};

export default moduleItem;
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const rules = require('./webpack.rules');

module.exports = {
  target: 'electron-renderer',
  module: {
    rules: [
      ...rules,
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              publicPath: '..', // move up from 'main_window'
              context: 'src', // set relative working folder to src
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve('src/assets'), to: './assets' }],
    }),
  ],
};

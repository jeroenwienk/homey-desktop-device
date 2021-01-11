const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Plugin = require('./Plugin');
const CopyPlugin = require('copy-webpack-plugin');

const rules = require('./webpack.rules');

module.exports = {
  entry: path.resolve('src/main/main.js'),
  target: 'electron-main',
  devtool: 'source-map',
  //externals: [nodeExternals()],
  module: {
    rules: [
      ...rules,
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    // new Plugin(),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve('node_modules'),
    //       to: '../node_modules',
    //     },
    //   ],
    // }),
  ],
};

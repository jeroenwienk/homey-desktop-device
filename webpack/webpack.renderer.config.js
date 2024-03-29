const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    }),
  ],
};

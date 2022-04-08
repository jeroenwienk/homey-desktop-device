const path = require('path');

const rules = require('./webpack.rules');

module.exports = {
  entry: path.resolve('src/main/main.js'),
  target: 'electron-main',
  devtool: 'source-map',
  module: {
    rules: [...rules],
  },
};

const path = require('path');

const rules = require('./webpack.rules');

console.log('\n');
console.log({
  NODE_ENV: process.env.NODE_ENV,
});
console.log('\n');

// const publicPath =
//   process.env.NODE_ENV === 'production'
//     ? 'resources/app.asar/.webpack/main/'
//     : '.webpack/main/';

module.exports = {
  entry: path.resolve('src/main/main.js'),
  target: 'electron-main',
  devtool: 'source-map',
  output: {
    // publicPath: '/',
    // This is probably sensitive to files with the same name.
    // assetModuleFilename: '[name][ext]',
  },
  module: {
    rules: [
      ...rules,
      // {
      //   test: /\.(png|jpe?g|gif|svg|ico|icns)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
};

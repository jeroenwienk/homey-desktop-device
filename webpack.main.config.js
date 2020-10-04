module.exports = {
  entry: './src/main/main.js',
  target: 'electron-main',
  module: {
    rules: require('./webpack.rules')
  }
};

const path = require('path');
const url = require('url');

const iconUrl = url.format({
  pathname: path.join(__dirname, 'home.png'),
});

module.exports = iconUrl;

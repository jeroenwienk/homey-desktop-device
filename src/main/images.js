const { nativeImage } = require('electron');

module.exports = {
  get white() {
    const icoPath = require('../assets/homey-white.ico');
    const imagePath = require('../assets/homey-white.png');

    require('../assets/homey-white@x1.5.png');
    require('../assets/homey-white@x2.png');
    require('../assets/homey-white@x3.png');
    require('../assets/homey-white@x4.png');

    const homeyWhiteImage = nativeImage.createFromPath(imagePath);
    const homeyWhiteIco = nativeImage.createFromPath(icoPath);

    return process.platform !== 'win32' ? homeyWhiteImage : homeyWhiteIco;
  },
  get colored() {
    const icoColoredPath = require('../assets/homey-colored.ico');
    const imageColoredPath = require('../assets/homey-colored.png');

    const homeyColoredImage = nativeImage.createFromPath(imageColoredPath);
    const homeyColoredIco = nativeImage.createFromPath(icoColoredPath);

    return process.platform !== 'win32' ? homeyColoredImage : homeyColoredIco;
  },
};

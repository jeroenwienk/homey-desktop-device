const path = require('path');
const { nativeImage } = require('electron');

module.exports = {
  get white() {
    const icoPath = path.resolve(__dirname, '../assets/homey-white.ico');
    const imagePath = path.resolve(__dirname, '../assets/homey-white.png');

    // This somehow move the images by some electron-forge webpack magic.
    path.resolve(__dirname, '../assets/homey-white@x1.5.png');
    path.resolve(__dirname, '../assets/homey-white@x2.png');
    path.resolve(__dirname, '../assets/homey-white@x3.png');
    path.resolve(__dirname, '../assets/homey-white@x4.png');

    // This doesn't work.
    // require('../assets/homey-white@x1.5.png');
    // require('../assets/homey-white@x2.png');
    // require('../assets/homey-white@x3.png');
    // require('../assets/homey-white@x4.png');

    const homeyWhiteImage = nativeImage.createFromPath(imagePath);
    const homeyWhiteIco = nativeImage.createFromPath(icoPath);

    return process.platform !== 'win32' ? homeyWhiteImage : homeyWhiteIco;
  },
  get colored() {
    const icoColoredPath = path.resolve(
      __dirname,
      '../assets/homey-colored.ico'
    );
    const imageColoredPath = path.resolve(
      __dirname,
      '../assets/homey-colored.png'
    );

    const homeyColoredImage = nativeImage.createFromPath(imageColoredPath);
    const homeyColoredIco = nativeImage.createFromPath(icoColoredPath);

    return process.platform !== 'win32' ? homeyColoredImage : homeyColoredIco;
  },
};

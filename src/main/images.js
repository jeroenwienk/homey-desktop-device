const path = require('path');
const { nativeImage } = require('electron');

// console.log({
//   __dirname: __dirname,
//   imagePath: imagePath,
//   icoPath: icoPath,
//   imageColoredPath: imageColoredPath,
//   icoColoredPath: icoColoredPath,
// });

module.exports = {
  get white() {
    const imagePath = path.join(__dirname, '../assets/homey-white.png');
    const icoPath = path.join(__dirname, '../assets/homey-white.ico');
    const homeyWhiteImage = nativeImage.createFromPath(imagePath);
    const homeyWhiteIco = nativeImage.createFromPath(icoPath);

    return process.platform !== 'win32' ? homeyWhiteImage : homeyWhiteIco;
  },
  get colored() {
    const imageColoredPath = path.join(
      __dirname,
      '../assets/homey-colored.png'
    );
    const icoColoredPath = path.join(__dirname, '../assets/homey-colored.ico');
    const homeyColoredImage = nativeImage.createFromPath(imageColoredPath);
    const homeyColoredIco = nativeImage.createFromPath(icoColoredPath);

    return process.platform !== 'win32' ? homeyColoredImage : homeyColoredIco;
  },
};

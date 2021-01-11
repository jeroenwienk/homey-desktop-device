const path = require('path');

require('dotenv').config();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/home.png',
    name: 'desktop-device',
    executeableName: 'desktop-device',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'desktop-device',
        iconUrl: path.resolve('src/assets/home.ico'),
        setupIcon: path.resolve('src/assets/home.ico'),
      },
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    // },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'desktop-device'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'desktop-device'
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'desktop-device',
        overwrite: true
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: 'jeroenwienk',
          name: 'homey-desktop-device',
        },
        prerelease: true,
      },
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack/webpack.main.config.js',
        renderer: {
          config: './webpack/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/renderer.js',
              name: 'main_window',
            },
            {
              html: './src/renderer/index.html',
              js: './src/renderer/overlay.js',
              name: 'overlay_window',
            },
          ],
        },
        port: 9000,
        loggerPort: 9001,
      },
    ],
  ],
};

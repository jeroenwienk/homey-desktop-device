const path = require('path');

require('dotenv').config();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/home.png',
    name: 'Desktop Device',
    // no idea why but maker-squirrel does not like desktop-device
    executableName: process.platform === 'win32' ? undefined : 'desktop-device',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'DesktopDevice',
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
        icon: path.resolve('src/assets/home.png'),
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'Desktop Device',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: path.resolve('src/assets/home.png'),
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'Desktop Device',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Desktop Device',
        overwrite: true,
        icon: path.resolve('src/assets/home.icns'),
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
              js: './src/overlay/overlay.js',
              name: 'overlay_window',
            },
          ],
        },
        devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src *",
        port: 9000,
        loggerPort: 9001,
      },
    ],
  ],
};

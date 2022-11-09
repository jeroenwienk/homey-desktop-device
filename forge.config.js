const path = require('path');

require('dotenv').config();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/homey-white.png',
    name: 'Desktop Device',
    // no idea why but maker-squirrel does not like desktop-device
    executableName: process.platform === 'win32' ? undefined : 'desktop-device',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        /**
         * A URL to an ICO file to use as the application icon
         * (displayed in Control Panel > Programs and Features).
         * Defaults to the Atom icon.
         */
        iconUrl: path.resolve('src/assets/homey-white.ico'),
        setupIcon: path.resolve('src/assets/homey-white.ico'),
        /**
         * Windows Application Model ID (appId).
         * Defaults to the name field in your app's package.json file.
         */
        name: 'DesktopDevice',
      },
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    // },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: path.resolve('src/assets/homey-white@x4.png'),
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'Desktop Device',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: path.resolve('src/assets/homey-white@x4.png'),
        bin: 'desktop-device',
        name: 'desktop-device',
        productName: 'Desktop Device',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.resolve('src/assets/homey-white.icns'),
        name: 'Desktop Device',
        overwrite: true,
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
        draft: true,
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack/webpack.main.config.js',
        renderer: {
          nodeIntegration: true,
          config: './webpack/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/shared/index.html',
              js: './src/renderer/renderer.js',
              name: 'main_window',
            },
            {
              html: './src/shared/index.html',
              js: './src/overlay/overlay.js',
              name: 'overlay_window',
            },
            {
              html: './src/shared/index.html',
              js: './src/commander/index.js',
              name: 'commander_window',
            },
          ],
        },
        devContentSecurityPolicy:
          "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src *",
        port: 9000,
        loggerPort: 9001,
      },
    },
  ],
};

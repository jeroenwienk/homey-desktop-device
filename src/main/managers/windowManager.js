const EventEmitter = require('events');
const { shell, globalShortcut } = require('electron');

const images = require('../images');

const { BaseBrowserWindow } = require('./BaseBrowserWindow');

class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.mainWindow = null;
    this.overlayWindow = null;
    this.webAppWindow = null;
    this.commanderWindow = null;

    this.isQuitting = false;
  }

  setIsQuitting(value) {
    this.mainWindow && (this.mainWindow.isQuitting = value);
    this.overlayWindow && (this.overlayWindow.isQuitting = value);
    this.webAppWindow && (this.webAppWindow.isQuitting = value);
    this.commanderWindow && (this.commanderWindow.isQuitting = value);
  }

  createMainWindow() {
    this.mainWindow = new BaseBrowserWindow(
      this,
      { name: 'mainWindow', url: MAIN_WINDOW_WEBPACK_ENTRY },
      {
        icon: images.white,
        backgroundColor: '#161b22',
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      }
    );
  }

  createOverlayWindow({ show = false } = {}) {
    this.overlayWindow = new BaseBrowserWindow(
      this,
      { name: 'overlayWindow', url: OVERLAY_WINDOW_WEBPACK_ENTRY },
      {
        icon: images.white,
        // backgroundColor: '#181818',
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        frame: false,
        transparent: true,
        skipTaskbar: true,
      }
    );

    if (show === true) {
      this.overlayWindow.show();
    }
  }

  createWebAppWindow() {
    this.webAppWindow = new BaseBrowserWindow(
      this,
      { name: 'webAppWindow', url: 'https://my.homey.app' },
      {
        icon: images.colored,
        backgroundColor: '#161b22',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      }
    );

    this.webAppWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);

      if (parsedUrl.origin !== 'https://my.homey.app') {
        event.preventDefault();
        console.log(`Prevented origin change: ${parsedUrl}`);
      }
    });

    this.webAppWindow.webContents.setWindowOpenHandler(({ url }) => {
      console.log(`Window open handler: ${url}`);

      // Should probably notify here and ask if open is desired.

      if (url?.startsWith('https://') === true) {
        setImmediate(() => {
          shell.openExternal(url).catch((error) => {
            console.error(error);
          });
        });
      }

      return { action: 'deny' };
    });
  }

  createCommanderWindow() {
    let debug = false;

    this.commanderWindow = new BaseBrowserWindow(
      this,
      { name: 'commanderWindow', url: COMMANDER_WINDOW_WEBPACK_ENTRY },
      {
        icon: images.white,
        backgroundColor: '#181818',
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },

        // transparent boolean (optional)
        // - Makes the window transparent. Default is false. On Windows, does not work unless the window is frameless.

        ...(debug !== true
          ? {
              frame: false,
              transparent: true,
              backgroundColor: undefined,
            }
          : {
              frame: true,
              transparent: false,
            }),

        skipTaskbar: false, // set to true on release
      }
    );

    // this.commanderWindow.setAlwaysOnTop(true, 'pop-up-menu')
    // this.commanderWindow.center();
    // this.commanderWindow.moveTop();
  }

  send(window, event, ...rest) {
    if (window.isDestroyed() === false && window.webContents != null) {
      window.webContents.send(event, ...rest);
    }
  }

  destroyWebAppWindow() {
    this.webAppWindow && this.webAppWindow.destroy();
    this.webAppWindow = null;
  }

  destroyOverlayWindow() {
    this.overlayWindow && this.overlayWindow.destroy();
    this.overlayWindow = null;
  }

  closeAll() {
    this.setIsQuitting(true);
    this.webAppWindow && this.webAppWindow.close();
    this.overlayWindow && this.overlayWindow.close();
    this.commanderWindow && this.commanderWindow.close();
    this.mainWindow && this.mainWindow.close();
  }

  toggleCommanderWindow() {
    if (this.commanderWindow.isVisible() === false || this.commanderWindow.isFocused() === false) {
      this.commanderWindow.show();
      this.commanderWindow.maximize();
      this.commanderWindow.webContents.focus();

      this.send(this.commanderWindow, 'focusComboBox', {
        data: true,
      });
    } else {
      this.commanderWindow.hide();
    }
  }

}

module.exports = {
  windowManager: new WindowManager(),
};

const path = require('path');
const EventEmitter = require('events');
const { BrowserWindow, shell } = require('electron');
const Store = require('electron-store');

const { debounce } = require('../../shared/debounce');

const store = new Store();

class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.mainWindow = null;
    this.overlayWindow = null;
    this.isQuitting = false;
  }

  setIsQuitting(value) {
    this.isQuitting = value;
  }

  createMainWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/homey-white.png');
    const icopath = path.resolve(__dirname, '../../assets/homey-white.ico');

    const storeWindowState = store.get('mainWindow.windowState');

    let windowState = {
      bounds: { x: null, y: null, width: 800, height: 600 },
      isMaximized: true,
      isHidden: false,
    };

    if (storeWindowState != null) {
      windowState = {
        ...windowState,
        ...storeWindowState,
      };
    }

    store.set('mainWindow.windowState', windowState);

    this.mainWindow = new BrowserWindow({
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
      icon: process.platform !== 'win32' ? imagepath : icopath,
      backgroundColor: '#161b22',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (windowState.isMaximized && windowState.isHidden === false) {
      this.mainWindow.maximize();
    }

    const saveBounds = debounce(() => {
      if (this.mainWindow.isMaximized()) {
        store.set('mainWindow.windowState.isMaximized', true);
        return;
      }

      store.set('mainWindow.windowState.bounds', this.mainWindow.getBounds());
      store.set('mainWindow.windowState.isMaximized', false);
    }, 200);

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV !== 'production') {
      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.on('maximize', (event) => {
      console.log('mainWindow:maximize');
    });

    this.mainWindow.on('minimize', (event) => {
      console.log('mainWindow:minimize');
    });

    this.mainWindow.on('restore', (event) => {
      console.log('mainWindow:restore');
      this.mainWindow.show();
    });

    this.mainWindow.on('close', (event) => {
      console.log('mainWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        this.mainWindow.hide();
      }
    });

    this.mainWindow.on('show', (event) => {
      console.log('mainWindow:show');
      store.set('mainWindow.windowState.isHidden', false);
    });

    this.mainWindow.on('hide', (event) => {
      console.log('mainWindow:hide');
      store.set('mainWindow.windowState.isHidden', true);
    });

    this.mainWindow.on('move', (event) => {
      saveBounds();
    });

    this.mainWindow.on('resize', (event) => {
      saveBounds();
    });

    this.mainWindow.webContents.on('dom-ready', (event) => {
      this.emit('main-window-dom-ready', event);
    });
  }

  sendToMainWindow(...args) {
    if (
      this.mainWindow.isDestroyed() === false &&
      this.mainWindow.webContents
    ) {
      this.mainWindow.webContents.send(...args);
    }
  }

  createOverlayWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/homey-white.png');
    const icopath = path.resolve(__dirname, '../../assets/homey-white.ico');
    const storeWindowState = store.get('overlayWindow.windowState');

    let windowState = {
      bounds: { x: null, y: null, width: 800, height: 600 },
      isMaximized: false,
      isHidden: false,
    };

    if (storeWindowState != null) {
      windowState = {
        ...windowState,
        ...storeWindowState,
      };
    }

    store.set('overlayWindow.windowState', windowState);

    this.overlayWindow = new BrowserWindow({
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
      icon: process.platform !== 'win32' ? imagepath : icopath,
      //backgroundColor: '#181818',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      frame: false,
      transparent: true,
      skipTaskbar: true,
    });

    if (windowState.isMaximized && windowState.isHidden === false) {
      this.overlayWindow.maximize();
    }

    const saveBounds = debounce(() => {
      if (this.overlayWindow.isMaximized()) {
        store.set('overlayWindow.windowState.isMaximized', true);
        return;
      }

      store.set(
        'overlayWindow.windowState.bounds',
        this.overlayWindow.getBounds()
      );
      store.set('overlayWindow.windowState.isMaximized', false);
    }, 200);

    //overlayWindow.setSkipTaskbar(true);
    this.overlayWindow.loadURL(OVERLAY_WINDOW_WEBPACK_ENTRY);
    //
    // if (process.env.NODE_ENV !== 'production') {
    //   this.overlayWindow.webContents.openDevTools();
    // }

    this.overlayWindow.on('minimize', (event) => {
      console.log('overlayWindow:minimize');
    });

    this.overlayWindow.on('restore', (event) => {
      console.log('overlayWindow:restore');
      this.overlayWindow.show();
    });

    this.overlayWindow.on('close', (event) => {
      console.log('overlayWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        this.overlayWindow.hide();
      }
    });

    this.overlayWindow.on('show', (event) => {
      console.log('overlayWindow:show');
      store.set('overlayWindow.windowState.isHidden', false);
    });

    this.overlayWindow.on('hide', (event) => {
      console.log('overlayWindow:hide');
      store.set('overlayWindow.windowState.isHidden', true);
    });

    this.overlayWindow.on('move', (event) => {
      saveBounds();
    });

    this.overlayWindow.on('resize', (event) => {
      saveBounds();
    });
  }

  sendToOverlayWindow(...args) {
    if (
      this.overlayWindow.isDestroyed() === false &&
      this.overlayWindow.webContents
    ) {
      this.overlayWindow.webContents.send(...args);
    }
  }

  createWebAppWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/homey-colored.png');
    const icopath = path.resolve(__dirname, '../../assets/homey-colored.ico');

    const storeWindowState = store.get('webAppWindow.windowState');

    let windowState = {
      bounds: { x: null, y: null, width: 800, height: 600 },
      isMaximized: true,
      isHidden: false,
    };

    if (storeWindowState != null) {
      windowState = {
        ...windowState,
        ...storeWindowState,
      };
    }

    store.set('webAppWindow.windowState', windowState);

    this.webAppWindow = new BrowserWindow({
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
      icon: process.platform !== 'win32' ? imagepath : icopath,
      backgroundColor: '#161b22',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.webAppWindow.webContents.on(
      'will-navigate',
      (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (parsedUrl.origin !== 'https://my.homey.app') {
          event.preventDefault();
          console.log(`Prevented origin change: ${parsedUrl}`);
        }
      }
    );

    this.webAppWindow.webContents.setWindowOpenHandler(({ url }) => {
      console.log(`Window open handler: ${url}`);

      // Should probably notify here and ask if open is desired.

      if (url?.startsWith('https://') === true) {
        setImmediate(() => {
          shell.openExternal(url);
        });
      }

      return { action: 'deny' };
    });

    if (windowState.isMaximized && windowState.isHidden === false) {
      this.webAppWindow.maximize();
    }

    const saveBounds = debounce(() => {
      if (this.webAppWindow.isMaximized()) {
        store.set('webAppWindow.windowState.isMaximized', true);
        return;
      }

      store.set(
        'webAppWindow.windowState.bounds',
        this.webAppWindow.getBounds()
      );
      store.set('webAppWindow.windowState.isMaximized', false);
    }, 200);

    this.webAppWindow.loadURL('https://my.homey.app/');

    if (process.env.NODE_ENV !== 'production') {
      this.webAppWindow.webContents.openDevTools();
    }

    this.webAppWindow.on('maximize', (event) => {
      console.log('webAppWindow:maximize');
    });

    this.webAppWindow.on('minimize', (event) => {
      console.log('webAppWindow:minimize');
    });

    this.webAppWindow.on('restore', (event) => {
      console.log('webAppWindow:restore');
      this.webAppWindow.show();
    });

    this.webAppWindow.on('close', (event) => {
      console.log('webAppWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        this.webAppWindow.hide();
      }
    });

    this.webAppWindow.on('show', (event) => {
      console.log('webAppWindow:show');
      store.set('webAppWindow.windowState.isHidden', false);
    });

    this.webAppWindow.on('hide', (event) => {
      console.log('webAppWindow:hide');
      store.set('webAppWindow.windowState.isHidden', true);
    });

    this.webAppWindow.on('move', (event) => {
      saveBounds();
    });

    this.webAppWindow.on('resize', (event) => {
      saveBounds();
    });

    this.webAppWindow.webContents.on('dom-ready', (event) => {
      this.emit('web-app-window-dom-ready', event);

      // this.webAppWindow.webContents.executeJavaScript('window.router.history.push(`/devices`);', true).then(result => {
      //   console.log(result);
      // }).catch(console.error);
    });
  }

  sendToWebAppWindow(...args) {
    if (
      this.webAppWindow.isDestroyed() === false &&
      this.webAppWindow.webContents
    ) {
      this.webAppWindow.webContents.send(...args);
    }
  }

  createCommanderWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/homey-white.png');
    const icopath = path.resolve(__dirname, '../../assets/homey-white.ico');
    const storeWindowState = store.get('commanderWindow.windowState');

    let windowState = {
      bounds: { x: null, y: null, width: 800, height: 600 },
      isMaximized: false,
      isHidden: false,
    };

    if (storeWindowState != null) {
      windowState = {
        ...windowState,
        ...storeWindowState,
      };
    }

    store.set('commanderWindow.windowState', windowState);

    let debug = true;

    this.commanderWindow = new BrowserWindow({
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
      icon: process.platform !== 'win32' ? imagepath : icopath,
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
          }
        : {
            frame: true,
            transparent: false,
          }),

      skipTaskbar: false, // set to true on release
    });

    // this.commanderWindow.setAlwaysOnTop(true, 'pop-up-menu')

    // this.commanderWindow.center();
    // this.commanderWindow.moveTop();

    if (windowState.isMaximized && windowState.isHidden === false) {
      this.commanderWindow.maximize();
    }

    const saveBounds = debounce(() => {
      if (this.commanderWindow.isMaximized()) {
        store.set('commanderWindow.windowState.isMaximized', true);
        return;
      }

      store.set(
        'commanderWindow.windowState.bounds',
        this.commanderWindow.getBounds()
      );
      store.set('commanderWindow.windowState.isMaximized', false);
    }, 200);

    //commanderWindow.setSkipTaskbar(true);
    this.commanderWindow.loadURL(COMMANDER_WINDOW_WEBPACK_ENTRY);
    //
    // if (process.env.NODE_ENV !== 'production') {
    //   this.commanderWindow.webContents.openDevTools();
    // }

    this.commanderWindow.on('minimize', (event) => {
      console.log('commanderWindow:minimize');
    });

    this.commanderWindow.on('restore', (event) => {
      console.log('commanderWindow:restore');
      this.commanderWindow.show();
    });

    this.commanderWindow.on('close', (event) => {
      console.log('commanderWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        this.commanderWindow.hide();
      }
    });

    this.commanderWindow.on('show', (event) => {
      console.log('commanderWindow:show');
      store.set('commanderWindow.windowState.isHidden', false);
    });

    this.commanderWindow.on('hide', (event) => {
      console.log('commanderWindow:hide');
      store.set('commanderWindow.windowState.isHidden', true);
    });

    this.commanderWindow.on('move', (event) => {
      saveBounds();
    });

    this.commanderWindow.on('resize', (event) => {
      saveBounds();
    });

    this.commanderWindow.webContents.on('dom-ready', (event) => {
      this.emit('commander-window-dom-ready', event);
    });
  }

  send(window, event, ...rest) {
    if (window.isDestroyed() === false && window.webContents != null) {
      window.webContents.send(event, ...rest);
    }
  }

  detroyWebAppWindow() {
    this.webAppWindow.destroy();
    this.webAppWindow = null;
  }

  closeAll() {
    this.isQuitting = true;
    this.webAppWindow.close();
    this.overlayWindow.close();
    this.commanderWindow.close();
    this.mainWindow.close();
  }
}

module.exports = {
  windowManager: new WindowManager(),
};

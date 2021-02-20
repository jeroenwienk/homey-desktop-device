const path = require('path');
const EventEmitter = require('events');
const { BrowserWindow } = require('electron');
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
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
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
      icon: imagepath,
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
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
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
      icon: imagepath,
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

  closeAll() {
    this.isQuitting = true;

    this.mainWindow.close();
    this.overlayWindow.close();
  }
}

module.exports = {
  windowManager: new WindowManager(),
};

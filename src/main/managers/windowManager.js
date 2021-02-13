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

    const mainWindow = new BrowserWindow({
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
      icon: imagepath,
      backgroundColor: '#181818',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (windowState.isMaximized) {
      mainWindow.maximize();
    }

    this.mainWindow = mainWindow;

    const saveBounds = debounce(() => {
      if (mainWindow.isMaximized()) {
        store.set('mainWindow.windowState.isMaximized', true);
        return;
      }

      store.set('mainWindow.windowState.bounds', mainWindow.getBounds());
      store.set('mainWindow.windowState.isMaximized', false);
    }, 200);

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV !== 'production') {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('minimize', (event) => {
      console.log('mainWindow:minimize');
    });

    mainWindow.on('restore', (event) => {
      console.log('mainWindow:restore');
      mainWindow.show();
    });

    mainWindow.on('close', (event) => {
      console.log('mainWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        mainWindow.hide();
      }
    });

    mainWindow.on('show', (event) => {
      console.log('mainWindow:show');
      store.set('mainWindow.windowState.isHidden', false);
    });

    mainWindow.on('hide', (event) => {
      console.log('mainWindow:hide');
      store.set('mainWindow.windowState.isHidden', true);
    });

    mainWindow.on('move', (event) => {
      console.log('move');
      saveBounds();
    });

    mainWindow.on('resize', (event) => {
      console.log('resize');
      saveBounds();
    });

    mainWindow.webContents.on('dom-ready', (event) => {
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
    const storeBounds = store.get('overlayWindow.bounds');

    const bounds =
      storeBounds != null
        ? storeBounds
        : { x: null, y: null, width: 800, height: 600 };

    const overlayWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
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

    this.overlayWindow = overlayWindow;

    const saveBounds = debounce(() => {
      store.set('overlayWindow.bounds', overlayWindow.getBounds());
    }, 200);

    //overlayWindow.setSkipTaskbar(true);
    overlayWindow.loadURL(OVERLAY_WINDOW_WEBPACK_ENTRY);
    //
    // if (process.env.NODE_ENV !== 'production') {
    //   overlayWindow.webContents.openDevTools();
    // }

    overlayWindow.on('minimize', (event) => {
      console.log('overlayWindow:minimize');
    });

    overlayWindow.on('restore', (event) => {
      console.log('overlayWindow:restore');
      overlayWindow.show();
    });

    overlayWindow.on('close', (event) => {
      console.log('overlayWindow:close');

      if (this.isQuitting === false) {
        event.preventDefault();
        overlayWindow.hide();
      }
    });

    overlayWindow.on('show', (event) => {
      console.log('overlayWindow:show');
    });

    overlayWindow.on('hide', (event) => {
      console.log('overlayWindow:hide');
    });

    overlayWindow.on('move', (event) => {
      saveBounds();
    });

    overlayWindow.on('resize', (event) => {
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

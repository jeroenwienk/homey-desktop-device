const path = require('path');
const EventEmitter = require('events');
const { BrowserWindow } = require('electron');
const Store = require('electron-store');
const store = new Store();

class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.mainWindow = null;
    this.overlayWindow = null;
  }

  createMainWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/home.png');

    const storeBounds = store.get('mainWindow.bounds');

    const bounds =
      storeBounds != null
        ? storeBounds
        : { x: null, y: null, width: 1440, height: 900 };

    const mainWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      icon: imagepath,
      backgroundColor: '#181818',
      webPreferences: {
        nodeIntegration: true,
      },
    });

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
      event.preventDefault();
      mainWindow.hide();
    });

    mainWindow.on('show', (event) => {
      console.log('mainWindow:show');
    });

    mainWindow.on('hide', (event) => {
      console.log('mainWindow:hide');
    });

    mainWindow.on('move', (event) => {
      store.set('mainWindow.bounds', mainWindow.getBounds());
    });

    mainWindow.on('resize', (event) => {
      store.set('mainWindow.bounds', mainWindow.getBounds());
    });

    mainWindow.webContents.on('dom-ready', (event) => {
      this.emit('main-window-dom-ready', event);
    });

    this.mainWindow = mainWindow;
  }

  sendToMainWindow(...args) {
    if (
      this.mainWindow.isDestroyed() === false &&
      this.mainWindow.webContents
    ) {
      this.mainWindow.webContents.send(...args);
    }
  }

  getMainWindow() {
    return this.mainWindow;
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
      },
      frame: false,
      transparent: true,
      skipTaskbar: true,
    });

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
      event.preventDefault();
      overlayWindow.hide();
    });

    overlayWindow.on('show', (event) => {
      console.log('overlayWindow:show');
    });

    overlayWindow.on('hide', (event) => {
      console.log('overlayWindow:hide');
    });

    overlayWindow.on('move', (event) => {
      store.set('overlayWindow.bounds', overlayWindow.getBounds());
    });

    overlayWindow.on('resize', (event) => {
      store.set('overlayWindow.bounds', overlayWindow.getBounds());
    });

    this.overlayWindow = overlayWindow;
  }

  sendToOverlayWindow(...args) {
    if (
      this.overlayWindow.isDestroyed() === false &&
      this.overlayWindow.webContents
    ) {
      this.overlayWindow.webContents.send(...args);
    }
  }

  getOverlayWindow() {
    return this.overlayWindow;
  }

  // todo: this is not the way
  destroy() {
    this.getMainWindow().destroy();
    this.getOverlayWindow().destroy();
  }
}

module.exports = new WindowManager();

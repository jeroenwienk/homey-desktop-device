const path = require('path');
const EventEmitter = require('events');
const { BrowserWindow } = require('electron');

class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.mainWindow = null;
  }

  createMainWindow() {
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      icon: imagepath,
      backgroundColor: '#292929',
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

    mainWindow.webContents.on('dom-ready', (event) => {
      this.emit('main-window-dom-ready', event);
    });

    this.mainWindow = mainWindow;
  }

  send(...args) {
    if (this.mainWindow.webContents) {
      this.mainWindow.webContents.send(...args);
    }
  }

  getMainWindow() {
    return this.mainWindow;
  }
}

module.exports = new WindowManager();

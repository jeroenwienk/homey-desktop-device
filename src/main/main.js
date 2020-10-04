const { app, BrowserWindow, Tray, Menu } = require('electron');
const Socket = require('./services/socket');
const mdns = require('./services/mdns');
const iconUrl = require('../images/iconUrl');

let socket = new Socket();
let mainWindow = null;
let tray = null;

function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

makeSingleInstance();

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconUrl,
    backgroundColor: '#292929',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }

  socket.setMainWindow(mainWindow);

  mainWindow.on('minimize', function (event) {
    // event.preventDefault();
    // mainWindow.minimize();
  });

  mainWindow.on('restore', function (event) {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}

function createTray() {
  const tray = new Tray(iconUrl);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click() {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    },
  ]);

  tray.on('click', (event) => {
    mainWindow.show();
  });

  tray.setToolTip('Homey Desktop');
  tray.setContextMenu(contextMenu);

  return tray;
}

app.on('ready', () => {
  mainWindow = createMainWindow();
  tray = createTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (event) => {
  event.preventDefault();
  mainWindow.hide();
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const { app, globalShortcut, BrowserWindow, Tray, Menu } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// DO NOT MOVE
if (require('electron-squirrel-startup')) return;

const path = require('path');
const db = require('./services/db');
const socket = require('./services/socket');
const MDNS = require('./services/mdns');
const ipcMainHandlers = require('./ipcMainHandlers');

const appFolder = path.dirname(process.execPath);
const updateExe = path.resolve(appFolder, '..', 'Update.exe');
const exeName = path.basename(process.execPath);

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  path: updateExe,
  args: [
    '--processStart',
    `"${exeName}"`,
    '--process-start-args',
    `"--hidden"`,
  ],
});

socket.setDataBase(db);
ipcMainHandlers.init();

const mdns = new MDNS();

let mainWindow = null;
let tray = null;

function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    console.log('app:second-instance');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

makeSingleInstance();

function createMainWindow() {
  const imagepath = path.resolve(__dirname, '../images/home.png');
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

  socket.setMainWindow(mainWindow);

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

  return mainWindow;
}

function createTray() {
  // TODO: seperate os dependant cases
  const imagepath = path.resolve(__dirname, '../images/home.ico');
  const tray = new Tray(imagepath);

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
        mainWindow.destroy();
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
  console.log('app:ready');
  mainWindow = createMainWindow();
  tray = createTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (event) => {
  console.log('app:window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('app:activate');
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

app.whenReady().then(() => {
  mdns.advertise();

  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+M', () => {
    console.log('CommandOrControl+M is pressed');
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('CommandOrControl+M'));
});

app.on('will-quit', async (event) => {
  console.log('will:quit');
  event.preventDefault();
  await socket.close();
  await mdns.close();

  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+M');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
  app.exit(0);
});

const { app, globalShortcut, BrowserWindow, Tray, Menu } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// DO NOT MOVE
if (require('electron-squirrel-startup')) return;

const path = require('path');
const db = require('./services/db');
const socket = require('./services/socket');
const MDNS = require('./services/mdns');
const ipcMainHandlers = require('./ipcMainHandlers');
const createMainWindow = require('./createMainWindow');
const createTray = require('./createTray');

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

app.on('ready', async () => {
  console.log('app:ready');
  mainWindow = createMainWindow();

  mainWindow.webContents.on('dom-ready', (event) => {
    socket.setMainWindow(mainWindow);
    socket.listen();
  })

  tray = createTray(mainWindow);

  await mdns.init();
  await mdns.advertise();

  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+M', () => {
    console.log('CommandOrControl+M is pressed');
  });

  if (!ret) {
    console.log('registration failed');
  }
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

// // macOS only
// app.on('activate', () => {
//   console.log('app:activate');
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     mainWindow = createMainWindow();
//     tray = tray.destroy();
//     tray = createTray(mainWindow);
//
//     socket.setMainWindow(mainWindow);
//
//   }
// });

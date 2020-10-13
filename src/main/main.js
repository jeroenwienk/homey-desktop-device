// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// DO NOT MOVE
if (require('electron-squirrel-startup')) return;

const { app, globalShortcut } = require('electron');

const MDNS = require('./services/mdns');
const serverSocket = require('./services/socket');
const ipcMainHandlers = require('./ipcMainHandlers');
const windowManager = require('./managers/windowManager');
const trayManager = require('./managers/trayManager');
const makeSingleInstance = require('./makeSingleInstance');
const setLoginItemSettings = require('./setLoginItemSettings');

setLoginItemSettings();
makeSingleInstance();

ipcMainHandlers.init();

const mdns = new MDNS();

app.on('ready', async () => {
  console.log('app:ready');

  windowManager.createMainWindow();
  trayManager.createTray();

  await mdns.init();
  await mdns.advertise();
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

  try {
    await serverSocket.close();
    await mdns.close();

    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+M');

    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  } catch (error) {
    console.error(error);
  }

  app.exit(0);
});

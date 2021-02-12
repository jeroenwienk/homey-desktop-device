// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// DO NOT MOVE
const squirrelStartup = require('electron-squirrel-startup');

const path = require('path');
const { app, globalShortcut } = require('electron');

if (squirrelStartup) {
  //app.quit();
  app.exit(0);
}

// if (true) {
//   require('inspector').open(9229, '0.0.0.0', true);
// }

const mdns = require('./services/mdns');
const serverSocket = require('./services/serverSocket');
const ipcMainHandlers = require('./ipcMainHandlers');
const windowManager = require('./managers/windowManager');
const trayManager = require('./managers/trayManager');
const makeSingleInstance = require('./makeSingleInstance');
const setLoginItemSettings = require('./setLoginItemSettings');
const { setApplicationMenu } = require('./setApplicationMenu');

setLoginItemSettings();
makeSingleInstance();
setApplicationMenu();

ipcMainHandlers.init();

app.on('ready', async () => {
  console.log('app:ready');

  windowManager.createMainWindow();
  windowManager.createOverlayWindow();
  trayManager.createTray();

  await mdns.init();
  await mdns.advertise();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// if (process.platform !== 'darwin') {
//   app.quit();
// }
app.on('window-all-closed', (event) => {
  console.log('app:window-all-closed');

  app.quit();
});

app.on('before-quit', (event) => {
  console.log('app:before-quit');

})

app.on('will-quit', async (event) => {
  console.log('will:quit');
  event.preventDefault();
  globalShortcut.unregisterAll();

  try {
    await serverSocket.close();
    await mdns.close();
  } catch (error) {
    console.error(error);
  }

  app.exit(0);
});

if (process.platform === 'darwin') {
  app.dock.setIcon(path.resolve(__dirname, '../assets/home.png'));
}

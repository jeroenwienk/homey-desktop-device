// DO NOT MOVE
const squirrelStartup = require('electron-squirrel-startup');

const { app, globalShortcut } = require('electron');

if (squirrelStartup) {
  app.exit(0);
}

// if (true) {
//   require('inspector').open(9229, '0.0.0.0', false);
// }

const { makeSingleInstance } = require('./makeSingleInstance');
const allowContinue = makeSingleInstance();

if (allowContinue === false) {
  app.exit(0);
}

const path = require('path');

const { mdns } = require('./services/mdns');
const { serverSocket } = require('./services/serverSocket');
const { db } = require('./services/db');

const { windowManager } = require('./managers/windowManager');
const { trayManager } = require('./managers/trayManager');

const { setLoginItemSettings } = require('./setLoginItemSettings');
const { setApplicationMenu } = require('./setApplicationMenu');

const { initIpcMainHandlers } = require('./ipcMainHandlers');

setLoginItemSettings();
setApplicationMenu();

initIpcMainHandlers();

console.log(app.getPath('userData'));

app.on('ready', async () => {
  console.log('app:ready');

  const settings = await db.getSettings();
  console.log(settings);

  if (settings.webAppWindowEnabled === true) {
    windowManager.createWebAppWindow();
  }

  windowManager.createMainWindow();
  windowManager.createOverlayWindow();

  trayManager.createTray();

  if (settings.webAppWindowEnabled === true) {
    trayManager.createWebAppTray();
  }

  const buttons = await db.getButtons();
  const trayButtons = buttons.filter((button) => {
    return button.tray === true;
  });

  trayManager.addButtons(trayButtons);

  await mdns.init();
  await mdns.advertise();
});

app.on('window-all-closed', (event) => {
  console.log('app:window-all-closed');
  app.quit();
});

app.on('before-quit', (event) => {
  console.log('app:before-quit');

  windowManager.setIsQuitting(true);
});

app.on('will-quit', async (event) => {
  console.log('app:will:quit');
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

// macOS only
app.on('activate', (event) => {
  windowManager.mainWindow.show();
});

if (process.platform === 'darwin') {
  app.dock.setIcon(path.resolve(__dirname, '../assets/homey-white.icns'));
}

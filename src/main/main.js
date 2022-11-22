// DO NOT MOVE
const squirrelStartup = require('electron-squirrel-startup');

const { app, globalShortcut } = require('electron');

if (squirrelStartup) {
  app.exit(0);
}

// if (true) {
//   require('inspector').open(9229, '0.0.0.0', true);
// }

const { makeSingleInstance } = require('./makeSingleInstance');
const allowContinue = makeSingleInstance();

if (allowContinue === false) {
  app.exit(0);
}

const { images } = require('./images');

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

console.log({
  cwd: process.cwd(),
  __dirname,
  __filename,
  userData: app.getPath('userData'),
});

app.on('ready', async () => {
  console.log('app:ready');

  const settings = await db.getSettings();
  console.log({ settings });

  // if (settings.webAppWindowEnabled === true) {
  //   windowManager.createWebAppWindow();
  // }

  windowManager.createMainWindow();
  windowManager.createCommanderWindow();

  trayManager.createTray();

  if (settings.overlayWindowEnabled === true) {
    windowManager.createOverlayWindow();
  }

  // if (settings.webAppWindowEnabled === true) {
  //   trayManager.createWebAppTray();
  // }

  const buttons = await db.getButtons();
  const trayButtons = buttons.filter((button) => {
    return button.tray === true;
  });

  trayManager.addButtons(trayButtons);

  try {
    windowManager.registerCommanderWindowShortcut(settings.commanderShortcutAccelerator);
  } catch (error) {
    console.error(error);
  }

  await mdns.init();
  await mdns.advertise();
});

app.whenReady().then(() => {});

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
  app.dock.setIcon(images.dock);
}

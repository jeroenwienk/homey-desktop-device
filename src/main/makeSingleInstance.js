const { app } = require('electron');

const { windowManager } = require('./managers/windowManager');

function makeSingleInstance() {
  if (process.mas) return;

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    return false;
  }

  app.on('second-instance', () => {
    console.log('app:second-instance');
    if (windowManager.mainWindow) {
      windowManager.mainWindow.show();
      windowManager.mainWindow.focus();
    }
  });

  return true;
}

module.exports = {
  makeSingleInstance,
};

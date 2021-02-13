const { app } = require('electron');

const { windowManager } = require('./managers/windowManager');

function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    console.log('app:second-instance');
    if (windowManager.mainWindow) {
      if (windowManager.mainWindow.isMinimized())
        windowManager.mainWindow.restore();
      windowManager.mainWindow.focus();
    }
  });
}

module.exports = {
  makeSingleInstance,
};

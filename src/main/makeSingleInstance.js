const { app } = require('electron');

const windowManager = require('./managers/windowManager');

function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    console.log('app:second-instance');
    if (windowManager.getMainWindow()) {
      if (windowManager.getMainWindow().isMinimized())
        windowManager.getMainWindow().restore();
      windowManager.getMainWindow().focus();
    }
  });
}

module.exports = makeSingleInstance;

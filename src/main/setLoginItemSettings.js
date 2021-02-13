const path = require('path');
const { app } = require('electron');

function setLoginItemSettings() {
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
      `"--hidden"`
    ]
  });
}

module.exports = {
  setLoginItemSettings
};

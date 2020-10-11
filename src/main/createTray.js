const { app, Tray, Menu } = require('electron');
const path = require('path');

function createTray(mainWindow) {
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

module.exports = createTray;

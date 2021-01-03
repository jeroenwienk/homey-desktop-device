const path = require('path');
const EventEmitter = require('events');
const { Tray, Menu, app } = require('electron');

const windowManager = require('./windowManager');

class TrayManager extends EventEmitter {
  constructor() {
    super();
    this.tray = null;
  }

  createTray() {
    // TODO: seperate os dependant cases
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
    const tray = new Tray(imagepath);

    const contextMenu = Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: 'Show',
        click() {
          windowManager.getMainWindow().show();
        },
      },
      {
        label: 'Set overlay always on top',
        click() {
          const overlayWindow = windowManager.getOverlayWindow();
          overlayWindow.setAlwaysOnTop(!overlayWindow.isAlwaysOnTop());
        },
      },
      {
        label: 'Disable overlay mouse',
        click() {
          const overlayWindow = windowManager.getOverlayWindow();
          overlayWindow.setIgnoreMouseEvents(true);
        },
      },
      {
        label: 'Enable overlay mouse',
        click() {
          const overlayWindow = windowManager.getOverlayWindow();
          overlayWindow.setIgnoreMouseEvents(false);
        },
      },
      {
        label: 'Show overlay',
        click() {
          const overlayWindow = windowManager.getOverlayWindow();
          overlayWindow.show();
        },
      },
      {
        label: 'Quit',
        click() {
          windowManager.getMainWindow().destroy();
          windowManager.getOverlayWindow().destroy();
          app.quit();
        },
      },
    ]);

    tray.on('click', (event) => {
      windowManager.getMainWindow().show();
    });

    tray.setToolTip('Homey Desktop');
    tray.setContextMenu(contextMenu);

    this.tray = tray;
  }

  getTray() {
    return this.tray;
  }
}

module.exports = new TrayManager();

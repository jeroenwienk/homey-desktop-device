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
    // todo: seperate os dependant cases
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
    const tray = new Tray(imagepath);
    const overlayWindow = windowManager.getOverlayWindow();

    // todo: labels arent dynamic
    const contextMenu = Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: 'Show',
        click() {
          windowManager.getMainWindow().show();
        },
      },
      {
        label: overlayWindow.isAlwaysOnTop()
          ? 'Overlay disable always on top'
          : 'Overlay enable always on top',
        click() {
          overlayWindow.setAlwaysOnTop(!overlayWindow.isAlwaysOnTop());
        },
      },
      {
        label: 'Disable overlay mouse',
        click() {
          overlayWindow.setIgnoreMouseEvents(true);
        },
      },
      {
        label: 'Enable overlay mouse',
        click() {
          overlayWindow.setIgnoreMouseEvents(false);
        },
      },
      {
        label: overlayWindow.isVisible() ? 'Hide overlay' : 'Show Overlay',
        click() {
          if (overlayWindow.isVisible()) {
            overlayWindow.hide();
          } else {
            overlayWindow.show();
          }
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

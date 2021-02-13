const path = require('path');
const EventEmitter = require('events');
const { Tray, Menu, app } = require('electron');

const { windowManager } = require('./windowManager');

class TrayManager extends EventEmitter {
  constructor() {
    super();
    this.tray = null;
  }

  createTray() {
    const imagepath = path.resolve(__dirname, '../../assets/home.png');
    const tray = new Tray(imagepath);

    const contextMenu = this.buildMenu();

    tray.on('click', (event) => {
      windowManager.mainWindow.show();
    });

    tray.setToolTip('Desktop Device');
    tray.setContextMenu(contextMenu);

    tray.on('right-click', (event) => {
      this.rebuildMenu();
    });

    this.tray = tray;
  }

  rebuildMenu() {
    this.tray.setContextMenu(this.buildMenu());
  }

  buildMenu = () => {
    const overlayWindow = windowManager.overlayWindow;
    const mainWindow = windowManager.mainWindow;

    return Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: mainWindow.isVisible() ? 'Hide' : 'Show',
        click: () => {
          if (mainWindow.isVisible()) {
            mainWindow.hide();
          } else {
            mainWindow.show();
          }
          this.rebuildMenu();
        }
      },
      {
        label: overlayWindow.isVisible() ? 'Hide overlay' : 'Show Overlay',
        click: () => {
          if (overlayWindow.isVisible()) {
            overlayWindow.hide();
          } else {
            overlayWindow.show();
          }
          this.rebuildMenu();
        }
      },
      { type: 'separator' },
      {
        label: overlayWindow.isAlwaysOnTop()
               ? 'Overlay disable always on top'
               : 'Overlay enable always on top',
        click: () => {
          overlayWindow.setAlwaysOnTop(!overlayWindow.isAlwaysOnTop());
          this.rebuildMenu();
        }
      },
      {
        label: 'Disable overlay mouse',
        click() {
          overlayWindow.setIgnoreMouseEvents(true);
        }
      },
      {
        label: 'Enable overlay mouse',
        click() {
          overlayWindow.setIgnoreMouseEvents(false);
        }
      },
      {
        label: 'Quit',
        click() {
          windowManager.closeAll();
        }
      }
    ]);
  };

  getTray() {
    return this.tray;
  }
}

module.exports = {
  trayManager: new TrayManager()
};

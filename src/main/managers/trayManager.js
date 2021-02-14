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

    tray.setToolTip('Desktop Device');
    tray.setContextMenu(contextMenu);

    tray.on('click', (event) => {
      windowManager.mainWindow.show();
    });

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

    return Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: 'Show Overlay',
        click: () => {
          overlayWindow.show();
          this.rebuildMenu();
        },
      },
      {
        label: 'Hide Overlay',
        click: () => {
          overlayWindow.hide();
          this.rebuildMenu();
        },
      },
      { type: 'separator' },
      {
        label: overlayWindow.isAlwaysOnTop()
          ? 'Overlay disable always on top'
          : 'Overlay enable always on top',
        click: () => {
          overlayWindow.setAlwaysOnTop(!overlayWindow.isAlwaysOnTop());
          this.rebuildMenu();
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
        label: 'Quit',
        click() {
          windowManager.closeAll();
        },
      },
    ]);
  };
}

module.exports = {
  trayManager: new TrayManager(),
};

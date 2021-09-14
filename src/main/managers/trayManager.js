const path = require('path');
const EventEmitter = require('events');
const { Tray, Menu } = require('electron');

const { IO_EMIT } = require('../../shared/events');

const { serverSocket } = require('../services/serverSocket');
const { windowManager } = require('./windowManager');

class TrayManager extends EventEmitter {
  constructor() {
    super();
    this.tray = null;
    this.buttons = null;
  }

  createTray() {
    const imagepath = path.resolve(__dirname, '../../assets/homey-white.png');
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
    const items = [];

    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      items.push({
        label: 'Open',
        click: () => {
          windowManager.mainWindow.show();
          this.rebuildMenu();
        },
      });
    }

    return Menu.buildFromTemplate([
      { type: 'separator' },
      ...(this.buttons || []).map((button) => {
        return {
          label: button.name,
          click: () => {
            serverSocket.io.emit(IO_EMIT.BUTTON_RUN, {
              id: button.id,
            });
          },
        };
      }),
      { type: 'separator' },
      ...items,
      {
        label: 'Show Overlay',
        click: () => {
          windowManager.overlayWindow.show();
          this.rebuildMenu();
        },
      },
      {
        label: 'Hide Overlay',
        click: () => {
          windowManager.overlayWindow.hide();
          this.rebuildMenu();
        },
      },
      { type: 'separator' },
      {
        label: windowManager.overlayWindow.isAlwaysOnTop()
          ? 'Overlay disable always on top'
          : 'Overlay enable always on top',
        click: () => {
          windowManager.overlayWindow.setAlwaysOnTop(
            !windowManager.overlayWindow.isAlwaysOnTop()
          );
          this.rebuildMenu();
        },
      },
      {
        label: 'Disable overlay mouse',
        click() {
          windowManager.overlayWindow.setIgnoreMouseEvents(true);
        },
      },
      {
        label: 'Enable overlay mouse',
        click() {
          windowManager.overlayWindow.setIgnoreMouseEvents(false);
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

  addButtons(buttons) {
    this.buttons = buttons;
    this.rebuildMenu();
  }
}

module.exports = {
  trayManager: new TrayManager(),
};

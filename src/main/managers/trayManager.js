const EventEmitter = require('events');
const { Tray, Menu } = require('electron');

const { IO_EMIT } = require('../../shared/events');

const { serverSocket } = require('../services/serverSocket');
const { windowManager } = require('./windowManager');

const images = require('../images');

class TrayManager extends EventEmitter {
  constructor() {
    super();
    this.tray = null;
    this.webAppTray = null;
    this.buttons = null;
  }

  createTray() {
    const tray = new Tray(images.white);

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

      ...(windowManager.overlayWindow
        ? [
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
                windowManager.overlayWindow.setAlwaysOnTop(!windowManager.overlayWindow.isAlwaysOnTop());
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
          ]
        : []),
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

  createWebAppTray() {
    const webAppTray = new Tray(images.colored);

    // const contextMenu = this.buildMenu();

    webAppTray.setToolTip('Web App');
    // tray.setContextMenu(contextMenu);

    webAppTray.on('click', (event) => {
      windowManager.webAppWindow.show();
    });

    webAppTray.on('right-click', (event) => {
      // this.rebuildMenu();
    });

    this.webAppTray = webAppTray;
  }

  destroyWebAppTray() {
    this.webAppTray && this.webAppTray.destroy();
    this.webAppTray = null;
  }
}

module.exports = {
  trayManager: new TrayManager(),
};

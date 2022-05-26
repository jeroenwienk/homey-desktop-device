import { debounce } from '../../shared/debounce';

const { BrowserWindow } = require('electron');

const { store } = require('./windowStore');

export class BaseBrowserWindow extends BrowserWindow {
  constructor(manager, options, windowOptions) {
    const storeWindowState = store.get(`${options.name}.windowState`);

    let windowState = {
      bounds: { x: null, y: null, width: 800, height: 600 },
      isMaximized: true,
      isHidden: false,
    };

    if (storeWindowState != null) {
      windowState = {
        ...windowState,
        ...storeWindowState,
      };
    }

    store.set(`${options.name}.windowState`, windowState);

    const baseOptions = {
      x: windowState.bounds.x,
      y: windowState.bounds.y,
      width: windowState.bounds.width,
      height: windowState.bounds.height,
      show: windowState.isHidden === false,
    };

    super({ ...windowOptions, ...baseOptions });
    this.manager = manager;

    if (windowState.isMaximized && windowState.isHidden === false) {
      this.maximize();
    }

    const saveBounds = debounce(() => {
      if (this.isMaximized()) {
        store.set(`${options.name}.windowState.isMaximized`, true);
        return;
      }

      store.set(`${options.name}.windowState.bounds`, this.getBounds());
      store.set(`${options.name}.windowState.isMaximized`, false);
    }, 200);

    this.loadURL(options.url);

    if (process.env.NODE_ENV !== 'production') {
      this.webContents.openDevTools();
    }

    this.on('maximize', (event) => {
      console.log(`${options.name}:maximize`);
    });

    this.on('minimize', (event) => {
      console.log(`${options.name}:minimize`);
    });

    this.on('restore', (event) => {
      console.log(`${options.name}:restore`);
      this.show();
    });

    this.on('close', (event) => {
      console.log(`${options.name}:close`);

      if (this.isQuitting === false) {
        event.preventDefault();
        this.hide();
      }
    });

    this.on('show', (event) => {
      console.log(`${options.name}:show`);
      store.set(`${options.name}.windowState.isHidden`, false);
    });

    this.on('hide', (event) => {
      console.log(`${options.name}:hide`);
      store.set(`${options.name}.windowState.isHidden`, true);
    });

    this.on('move', (event) => {
      saveBounds();
    });

    this.on('resize', (event) => {
      saveBounds();
    });

    this.webContents.on('dom-ready', (event) => {
      this.manager.emit(`${options.name}-dom-ready`, event);
    });

    this.isQuitting = false;
  }
}

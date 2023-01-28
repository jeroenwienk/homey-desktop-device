const { app, ipcMain, globalShortcut, shell, clipboard } = require('electron');
const jp = require('jsonpath');
const { db } = require('./services/db');
const { serverSocket } = require('./services/serverSocket');
const { exec } = require('child_process');

const { windowManager } = require('./managers/windowManager');
const { acceleratorManager } = require('./managers/acceleratorManager');

const { REND, OVERLAY, MAIN, IO_EMIT, IO_ON, events } = require('../shared/events');
const { trayManager } = require('./managers/trayManager');

function initIpcMainHandlers() {
  ipcMain.on(REND.INIT, handleRendererInit);
  ipcMain.on(OVERLAY.INIT, handleOverlayInit);

  ipcMain.on(REND.BUTTON_CREATE, handleButtonCreate);
  ipcMain.on(REND.BUTTON_UPDATE, handleButtonUpdate);
  ipcMain.on(REND.BUTTON_REMOVE, handleButtonRemove);
  ipcMain.on(REND.BUTTON_RUN, handleButtonRun);

  ipcMain.on(REND.ACCELERATOR_CREATE, handleAcceleratorCreate);
  ipcMain.on(REND.ACCELERATOR_UPDATE, handleAcceleratorUpdate);
  ipcMain.on(REND.ACCELERATOR_REMOVE, handleAcceleratorRemove);
  ipcMain.on(REND.ACCELERATOR_RUN, handleAcceleratorRun);

  ipcMain.on(REND.DISPLAY_CREATE, handleDisplayCreate);
  ipcMain.on(REND.DISPLAY_UPDATE, handleDisplayUpdate);
  ipcMain.on(REND.DISPLAY_REMOVE, handleDisplayRemove);

  ipcMain.on(REND.INPUT_CREATE, handleInputCreate);
  ipcMain.on(REND.INPUT_UPDATE, handleInputUpdate);
  ipcMain.on(REND.INPUT_REMOVE, handleInputRemove);
  ipcMain.on(REND.INPUT_RUN, handleInputRun);

  ipcMain.on(REND.SETTINGS_UPDATE, handleSettingsUpdate);

  ipcMain.handle(REND.TEST, handleExecRunTest);

  ipcMain.handle('version', async (event, args) => {
    return { version: app.getVersion() };
  });

  ipcMain.handle(events.ON_COMMANDER_WINDOW_MESSAGE, async (event, args) => {
    const { message, data } = args;

    switch (message) {
      case 'close':
        windowManager.commanderWindow.close();
        break;
      case 'init':
        return handleCommanderInit();
      case 'openPath':
        return shell.openPath(data.path);
      case 'openExternal':
      case 'openInBrowser':
        return shell.openExternal(data.url);
      case 'openInWindow': {
        if (windowManager.webAppWindow == null) {
          throw new Error(`Window is disabled.`);
        }

        const state = data.state ? JSON.stringify(data.state) : null;

        windowManager.webAppWindow.show();
        let code = `window.router.history.push('${data.path}')`;

        if (state != null) {
          code = `window.router.history.push('${data.path}', ${state})`;
        }

        return windowManager.webAppWindow.webContents.executeJavaScript(code, true);
      }
      case 'openWebAppWindow': {
        if (windowManager.webAppWindow == null) {
          throw new Error(`Window is disabled.`);
        }

        windowManager.webAppWindow.show();

        break;
      }
      case 'writeToClipBoard': {
        clipboard.writeText(data.text);
        break;
      }
      case 'writeJSONPathToClipBoard': {
        const result = jp.query(data.value, data.path);

        if (result == null) {
          throw new Error(`No result for path '${data.path}'`);
        }

        if (result?.length === 1) {
          const value = result[0];

          if (typeof value === 'string') {
            clipboard.writeText(value);
          } else {
            clipboard.writeText(JSON.stringify(result[0], null, 2));
          }
        } else {
          clipboard.writeText(JSON.stringify(result, null, 2));
        }
        break;
      }
      case 'sendCommand': {
        const connected = await serverSocket.getConnected();

        // Should only be one.
        for (const socket of connected) {
          if (serverSocket.getHomeyId(socket) === data.homeyId) {
            return serverSocket.send(socket, {
              event: events.SEND_COMMAND,
              args: { data },
            });
          }
        }

        break;
      }
      default:
        break;
    }
  });
}

async function handleExecRunTest(event, args) {
  return new Promise((resolve, reject) => {
    exec(args.command, { timeout: 0, cwd: '/' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve({ stdout, stderr });
    });
  });
}

async function handleRendererInit(event, args) {
  const history = await db.getHistory();
  const settings = await db.getSettings();
  const buttons = await db.getButtons();
  const accelerators = await db.getAccelerators();
  const displays = await db.getDisplays();
  const inputs = await db.getInputs();
  const connections = await serverSocket.getConnections();

  registerAccelerators(accelerators);

  event.reply(MAIN.HISTORY_INIT, history);
  event.reply(MAIN.SETTINGS_INIT, settings);
  event.reply(MAIN.BUTTONS_INIT, buttons);
  event.reply(MAIN.ACCELERATORS_INIT, accelerators);
  event.reply(MAIN.DISPLAYS_INIT, displays);
  event.reply(MAIN.INPUTS_INIT, inputs);
  event.reply(MAIN.SOCKETS_INIT, connections);

  const connected = await serverSocket.getConnected();

  for (const socket of connected) {
    serverSocket.sync(socket);
  }
}

async function handleSettingsUpdate(event, args) {
  try {
    const previousSettings = await db.getSettings();
    await db.updateSettings(args);

    if (previousSettings.webAppWindowEnabled !== args.webAppWindowEnabled) {
      if (args.webAppWindowEnabled === true) {
        windowManager.createWebAppWindow();
        trayManager.createWebAppTray();
      } else {
        trayManager.destroyWebAppTray();
        windowManager.destroyWebAppWindow();
      }
    }

    if (previousSettings.overlayWindowEnabled !== args.overlayWindowEnabled) {
      if (args.overlayWindowEnabled === true) {
        windowManager.createOverlayWindow({ show: true });
      } else {
        windowManager.destroyOverlayWindow();
      }
    }

    if (args.commanderShortcutAcceleratorKeys) {
      acceleratorManager.registerCommanderShortcutAccelerator(args.commanderShortcutAcceleratorKeys, () => {
        windowManager.toggleCommanderWindow();
      })
    }

  } catch (error) {
    console.error(error);
  }
}

async function handleOverlayInit(event, args) {
  const displays = await db.getDisplays();
  event.reply(MAIN.DISPLAYS_INIT, displays);
}

async function handleCommanderInit(event, args) {
  const connected = await serverSocket.getConnected();

  for (const socket of connected) {
    socket.timeout(5000).emit(events.GET_API_PROPS, { data: null }, (timeout, error, response) => {
      if (timeout != null) {
        console.log(timeout);
        return;
      }

      if (error != null) {
        console.log(error);
        return;
      }

      if (response.data == null) {
        console.log('Missing response data', response);
        return;
      }

      windowManager.send(windowManager.commanderWindow, events.ON_API_PROPS, {
        ...response.data,
        address: socket.handshake.address,
        homeyId: socket.handshake.query.homeyId,
        name: socket.handshake.query.name,
      });
    });

    socket.timeout(5000).emit(events.GET_COMMAND_ARGUMENT_VALUES, { data: null }, (timeout, error, response) => {
      if (timeout != null) {
        console.log(timeout);
        return;
      }

      if (error != null) {
        console.log(error);
        return;
      }

      if (response.data == null) {
        console.log('Missing response data', response);
        return;
      }

      windowManager.send(windowManager.commanderWindow, events.ON_COMMAND_ARGUMENT_VALUES, response.data);
    });
  }
}

async function handleButtonCreate(event, args) {
  try {
    await db.insertButton(args);
    await emitButtonsSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleButtonUpdate(event, args) {
  try {
    await db.updateButton(args.id, args);
    await emitButtonsSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleButtonRemove(event, args) {
  try {
    await db.removeButton(args.id);
    await emitButtonsSync(event);
  } catch (error) {
    console.error(error);
  }
}

function handleButtonRun(event, args) {
  serverSocket.io.emit(IO_EMIT.BUTTON_RUN, args);
}

async function emitButtonsSync(event) {
  const buttons = await db.getButtons();
  serverSocket.io.emit(IO_EMIT.BUTTON_RUN, { buttons });

  const trayButtons = buttons.filter((button) => {
    return button.tray === true;
  });

  trayManager.addButtons(trayButtons);
}

async function handleAcceleratorCreate(event, args) {
  try {
    await db.insertAccelerator(args);
    await emitAcceleratorsSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleAcceleratorUpdate(event, args) {
  try {
    await db.updateAccelerator(args.id, args);
    await emitAcceleratorsSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleAcceleratorRemove(event, args) {
  try {
    await db.removeAccelerator(args.id);
    await emitAcceleratorsSync(event);
  } catch (error) {
    console.error(error);
  }
}

function handleAcceleratorRun(event, args) {
  serverSocket.io.emit(events.ACCELERATOR_RUN, args);
}

async function emitAcceleratorsSync(event) {
  const accelerators = await db.getAccelerators();
  registerAccelerators(accelerators);
  serverSocket.io.emit(events.ACCELERATORS_SYNC, { accelerators });
}

function registerAccelerators(accelerators) {
  // this is a race with main.js register
  // find another way to redo the registered accelerators
  // globalShortcut.unregisterAll();

  // TODO: fails on arrows

  const mapped = accelerators.map(accelerator => {
    return {
      keys: accelerator.keys,
      callback: () => {
        windowManager.send(windowManager.mainWindow, MAIN.ACCELERATOR_TEST, {
          id: accelerator.id,
        });

        serverSocket.io.emit(events.ACCELERATOR_RUN, { id: accelerator.id });
      }
    }
  })

  acceleratorManager.registerRendererAccelerators(mapped)

  // accelerators.forEach((accelerator) => {
  //   try {
  //     acceleratorManager.register(accelerator.keys, () => {
  //       windowManager.send(windowManager.mainWindow, MAIN.ACCELERATOR_TEST, {
  //         id: accelerator.id,
  //       });

  //       serverSocket.io.emit(events.ACCELERATOR_RUN, { id: accelerator.id });
  //     })

  //     // const ret = globalShortcut.register(accelerator.keys.replaceAll(' ', '+'), () => {
  //     //   windowManager.send(windowManager.mainWindow, MAIN.ACCELERATOR_TEST, {
  //     //     id: accelerator.id,
  //     //   });

  //     //   serverSocket.io.emit(events.ACCELERATOR_RUN, { id: accelerator.id });
  //     // });

  //     // if (!ret) {
  //     //   console.log('registration failed');
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
}

async function handleDisplayCreate(event, args) {
  try {
    await db.insertDisplay(args);
    await emitDisplaySync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleDisplayUpdate(event, args) {
  try {
    await db.updateDisplay(args.id, args);
    await emitDisplaySync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleDisplayRemove(event, args) {
  try {
    await db.removeDisplay(args.id);
    await emitDisplaySync(event);
  } catch (error) {
    console.error(error);
  }
}

async function emitDisplaySync(event) {
  const displays = await db.getDisplays();
  windowManager.send(windowManager.overlayWindow, MAIN.DISPLAYS_INIT, displays);
  serverSocket.io.emit(events.DISPLAYS_SYNC, { displays });
}

async function handleInputCreate(event, args) {
  try {
    await db.insertInput(args);
    await emitInputSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleInputUpdate(event, args) {
  try {
    await db.updateInput(args.id, args);
    await emitInputSync(event);
  } catch (error) {
    console.error(error);
  }
}

async function handleInputRemove(event, args) {
  try {
    await db.removeInput(args.id);
    await emitInputSync(event);
  } catch (error) {
    console.error(error);
  }
}

function handleInputRun(event, args) {
  serverSocket.io.emit(IO_EMIT.INPUT_RUN, args);
}

async function emitInputSync(event) {
  const inputs = await db.getInputs();
  serverSocket.io.emit(events.INPUTS_SYNC, { inputs });
}

module.exports = { initIpcMainHandlers };

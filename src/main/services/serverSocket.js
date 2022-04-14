const { shell, screen, Notification } = require('electron');
const { exec } = require('child_process');

const https = require('https');
const selfsigned = require('selfsigned');
const { Server } = require('socket.io');

const { db } = require('./db');
const { windowManager } = require('../managers/windowManager');

const { MAIN, REND, IO_EMIT, IO_ON, events } = require('../../shared/events');

class ServerSocket {
  constructor() {
    console.log('socket:constructor');

    const attrs = [{ name: 'commonName', value: 'nl.jwienk.desktop-device' }];
    const pems = selfsigned.generate(attrs, { days: 365 });

    this.httpsServer = https.createServer({
      key: pems.private,
      cert: pems.cert,
    });

    this.options = {
      path: '/desktop',
      serveClient: false,
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 10e7,
    };

    this.io = new Server(this.httpsServer, this.options);

    this.io.on('connect', this.handleConnect.bind(this));

    this.io.use((socket, next) => {
      // let handshake = socket.handshake;
      // console.log(handshake);
      //
      // const res = dialog.showMessageBoxSync({
      //   type: 'question',
      //   buttons: ['accept', 'cancel'],
      //   defaultId: 0,
      //   cancelId: 1,
      //   title: 'Accept connection',
      //   message: handshake.query.name,
      // });
      //
      // console.log(res);
      //
      // if (res === 0) {
      //   next();
      // } else {
      //   socket.disconnect(true);
      // }

      next();
    });

    windowManager.once('mainWindow-dom-ready', (event) => {
      this.listen();
    });
  }

  listen() {
    if (this.httpsServer.listening === false) {
      this.httpsServer.listen(3106, () => {
        console.log('listening on *:3106');
      });
    }
  }

  handleConnect(socket) {
    console.log('connect:', socket.id);

    this.getConnections().then((result) => {
      windowManager.send(windowManager.mainWindow, MAIN.SOCKETS_INIT, result);
    });

    socket.on('disconnect', (reason) => {
      console.log('disconnect:', reason);
      this.getConnections().then((result) => {
        windowManager.send(windowManager.mainWindow, MAIN.SOCKETS_INIT, result);
      });
    });

    socket.on('disconnecting', (reason) => {
      console.log('disconnecting:', reason);
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on(IO_ON.BROWSER_OPEN_RUN, (...args) => {
      this.handleBrowserOpen(...args);
    });

    socket.on(IO_ON.PATH_OPEN_RUN, (...args) => {
      this.handlePathOpen(...args);
    });

    socket.on(IO_ON.WINDOW_ACTION_RUN, (...args) => {
      this.handleWindowActionRun(...args);
    });

    socket.on(IO_ON.WINDOW_MOVE_RUN, (...args) => {
      this.handleWindowMoveRun(...args);
    });

    socket.on(IO_ON.NOTIFICATION_SHOW_RUN, (...args) => {
      this.handleNotificationShow(...args);
    });

    socket.on(IO_ON.COMMAND_RUN, (...args) => {
      this.handleCommand(...args);
    });

    socket.on(IO_ON.DISPLAY_SET_RUN, (...args) => {
      this.handleDisplaySet(...args);
    });

    socket.on(IO_ON.WEB_APP_EXECUTE_CODE_RUN, (...args) => {
      this.handleWebAppExecuteCodeRun(...args);
    });

    socket.on(IO_ON.SCREENS_FETCH, (...args) => {
      this.handleScreensFetch(...args);
    });

    socket.on(events.ON_COMMAND_ARGUMENT_VALUES, (response, callback) => {
      windowManager.send(
        windowManager.commanderWindow,
        events.ON_COMMAND_ARGUMENT_VALUES,
        {
          ...response.data,
        }
      );
    });

    socket.on(IO_ON.FLOW_BUTTON_SAVED, (...args) => {
      // this.sync(socket);
    });

    socket.on(IO_ON.FLOW_ACCELERATOR_SAVED, (...args) => {
      // this.sync(socket);
    });

    socket.on(IO_ON.FLOW_DISPLAY_SAVED, (...args) => {
      // this.sync(socket);
    });

    socket.on(IO_ON.FLOW_INPUT_SAVED, (...args) => {
      // this.sync(socket);
    });

    this.sync(socket);
  }

  async handleBrowserOpen(data, callback) {
    try {
      const historyEntry = await db.insertHistoryEntry({
        name: 'browser:open',
        argument: data.url,
        date: new Date(),
      });

      windowManager.send(windowManager.mainWindow, MAIN.HISTORY_PUSH, historyEntry);
      await shell.openExternal(data.url);
      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handlePathOpen(data, callback) {
    try {
      const historyEntry = await db.insertHistoryEntry({
        name: 'path:open',
        argument: data.path,
        date: new Date(),
      });

      windowManager.send(windowManager.mainWindow, MAIN.HISTORY_PUSH, historyEntry);
      await shell.openPath(data.path);
      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handleWindowActionRun(data, callback) {
    try {
      const historyEntry = await db.insertHistoryEntry({
        name: 'window:action',
        argument: `${data.window.name} - ${data.action.name}`,
        date: new Date(),
      });

      function doAction(window) {
        switch (data.action.id) {
          case 'open':
            window.show();
            break;
          case 'close':
            window.hide();
            break;
          case 'toggle':
            if (window.isVisible()) {
              window.hide();
            } else {
              window.show();
            }
            break;
          case 'maximize':
            window.maximize();
            break;
          case 'unmaximize':
            window.unmaximize();
            break;
          case 'minimize':
            window.minimize();
            break;
          case 'restore':
            window.restore();
            break;
          case 'focus':
            window.focus();
            break;
          case 'blur':
            window.blur();
            break;
        }
      }

      switch (data.window.id) {
        case 'main':
          doAction(windowManager.mainWindow);
          break;
        case 'overlay':
          doAction(windowManager.overlayWindow);
          break;
        case 'web_app':
          if (windowManager.webAppWindow != null) {
            doAction(windowManager.webAppWindow);
          } else {
            throw new Error(`Window ${data.window.name} is disabled.`);
          }
          break;
        default:
          break;
      }

      windowManager.send(windowManager.mainWindow, MAIN.HISTORY_PUSH, historyEntry);
      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handleWindowMoveRun(data, callback) {
    try {
      // const historyEntry = await db.insertHistoryEntry({
      //   name: 'window:move',
      //   argument: `${data.window.name} - ${data.action.name}`,
      //   date: new Date(),
      // });

      const screens = screen.getAllDisplays();
      const screenId = String(data.screen.id);

      const foundScreen = screens.find((screen) => {
        return String(screen.id) === screenId;
      });

      if (foundScreen == null) {
        throw new Error(`Can't find screen with id: ${screenId}`);
      }

      const bounds = {
        x: foundScreen.workArea.x,
        y: foundScreen.workArea.y,
        width: foundScreen.workArea.width,
        height: foundScreen.workArea.height,
      };

      switch (data.window.id) {
        case 'main':
          windowManager.mainWindow.setBounds(bounds);
          break;
        case 'overlay':
          windowManager.overlayWindow.setBounds(bounds);
          break;
        case 'web_app':
          if (windowManager.webAppWindow != null) {
            windowManager.webAppWindow.setBounds(bounds);
          } else {
            throw new Error(`Window ${data.window.name} is disabled.`);
          }
          break;
        default:
          break;
      }

      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  handleNotificationShow(data, callback) {
    try {
      const notification = new Notification({
        title: data.title != null ? data.title : 'Homey Desktop',
        body: data.body,
        silent: data.silent === 'true',
      });
      notification.show();
      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handleCommand(data, callback) {
    const execCommand = () =>
      new Promise((resolve, reject) => {
        exec(
          data.command,
          {
            timeout: data.timeout == null ? 0 : data.timeout,
            cwd: data.cwd == null ? '/' : data.cwd,
          },
          (error, stdout, stderr) => {
            if (error) {
              if (stderr.length > 0) {
                reject({ stderr });
                return;
              }

              reject(error);
              return;
            }
            // console.log('stdout', stdout);
            // console.log('stderr', stderr);
            resolve({ stdout, stderr });
          }
        );
      });

    try {
      const result = await execCommand();
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  }

  async handleDisplaySet(data, callback) {
    try {
      await db.updateDisplay(data.display.id, { text: data.text });
      windowManager.send(windowManager.overlayWindow, MAIN.DISPLAY_SET, data);
      callback();
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handleWebAppExecuteCodeRun(data, callback) {
    try {
      // const historyEntry = await db.insertHistoryEntry({
      //   name: 'window:action',
      //   argument: `${data.action.name} - ${data.window.name}`,
      //   date: new Date(),
      // });

      if (windowManager.webAppWindow == null) {
        throw new Error(`Window ${data.window.name} is disabled.`);
      }

      // Might not be serializeable.
      const result =
        await windowManager.webAppWindow.webContents.executeJavaScript(
          data.code,
          true
        );
      callback(null, result);
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async handleScreensFetch(data, callback) {
    try {
      const screens = screen.getAllDisplays();
      callback(null, { screens });
    } catch (error) {
      console.error(error);
      callback(error?.message);
    }
  }

  async send(socket, { event, args }) {
    return new Promise((resolve, reject) => {
      socket.timeout(5000).emit(event, args, (timeout, error, response) => {
        // is instanceof error
        if (timeout != null) {
          reject(timeout);
          return;
        }

        if (error != null && !(error instanceof Error)) {
          reject(new Error(String(error)));
          return;
        } else if (error != null) {
          reject(error);
          return;
        }

        resolve(response);
      });
    });
  }

  getHomeyId(socket) {
    return socket.handshake.query.homeyId;
  }

  async sync(socket) {
    try {
      const buttons = await db.getButtons();
      const accelerators = await db.getAccelerators();
      const displays = await db.getDisplays();
      const inputs = await db.getInputs();

      socket.emit(IO_EMIT.BUTTONS_SYNC, { buttons });
      socket.emit(IO_EMIT.ACCELERATORS_SYNC, { accelerators });
      socket.emit(IO_EMIT.DISPLAYS_SYNC, { displays });
      socket.emit(IO_EMIT.INPUTS_SYNC, { inputs });

      try {
        const response = await this.send(socket, {
          event: events.GET_API_PROPS,
          args: { data: null },
        });

        windowManager.send(windowManager.commanderWindow, events.ON_API_PROPS, {
          ...response.data,
          address: socket.handshake.address,
          homeyId: socket.handshake.query.homeyId,
          name: socket.handshake.query.name,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async close() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve();
      }, 5000);

      this.io.close(() => {
        console.log('io:closed');
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  async getConnected() {
    return await this.io.fetchSockets();
  }

  async getConnections() {
    const sockets = await this.io.fetchSockets();

    return sockets.map((socket) => {
      return {
        id: socket.id,
        socketId: socket.id,
        homeyId: socket.handshake.query.homeyId,
        name: socket.handshake.query.name,
        connected: socket.connected,
      };
    });
  }
}

module.exports = {
  serverSocket: new ServerSocket(),
};

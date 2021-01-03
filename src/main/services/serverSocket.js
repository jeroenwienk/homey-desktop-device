const { shell, Notification, dialog } = require('electron');
const https = require('https');
const { exec } = require('child_process');
const selfsigned = require('selfsigned');
const { Server } = require('socket.io');
const db = require('./db');
const windowManager = require('../managers/windowManager');

const { MAIN, REND, IO_EMIT, IO_ON } = require('../../shared/events');

class ServerSocket {
  constructor() {
    console.log('socket:constructor');

    const attrs = [{ name: 'commonName', value: 'nl.jwienk.desktop' }];
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
      let handshake = socket.handshake;
      // ...

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

    windowManager.once('main-window-dom-ready', (event) => {
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
    windowManager.sendToMainWindow(MAIN.SOCKETS_INIT, this.getConnections());

    socket.on('disconnect', (reason) => {
      console.log('disconnect:', reason);
      windowManager.sendToMainWindow(MAIN.SOCKETS_INIT, this.getConnections());
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

    socket.on(IO_ON.NOTIFICATION_SHOW_RUN, (...args) => {
      this.handleNotificationShow(...args);
    });

    socket.on(IO_ON.COMMAND_RUN, (...args) => {
      this.handleCommand(...args);
    });

    socket.on(IO_ON.DISPLAY_SET_RUN, (...args) => {
      this.handleDisplaySet(...args);
    });

    socket.on(IO_ON.BUTTON_RUN_SUCCESS, (args) => {
      console.log(IO_ON.BUTTON_RUN_SUCCESS, args);
    });

    // TODO: implement in app
    socket.on(IO_ON.BUTTON_RUN_ERROR, (args) => {
      console.log(IO_ON.BUTTON_RUN_ERROR, args);
    });

    socket.on(IO_ON.ACCELERATOR_RUN_SUCCESS, (args) => {
      console.log(IO_ON.ACCELERATOR_RUN_SUCCESS, args);
    });

    // TODO: implement in app
    socket.on(IO_ON.ACCELERATOR_RUN_ERROR, (args) => {
      console.log(IO_ON.ACCELERATOR_RUN_ERROR, args);
    });

    socket.on(IO_ON.FLOW_BUTTON_SAVED, (...args) => {
      this.sync(socket);
    });

    socket.on(IO_ON.FLOW_ACCELERATOR_SAVED, (...args) => {
      this.sync(socket);
    });

    socket.on(IO_ON.FLOW_ACCELERATOR_SAVED, (...args) => {
      this.sync(socket);
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

      windowManager.sendToMainWindow(MAIN.HISTORY_PUSH, historyEntry);
      await shell.openExternal(data.url);
      callback();
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }

  async handlePathOpen(data, callback) {
    try {
      const historyEntry = await db.insertHistoryEntry({
        name: 'path:open',
        argument: data.path,
        date: new Date(),
      });

      windowManager.sendToMainWindow(MAIN.HISTORY_PUSH, historyEntry);
      await shell.openPath(data.path);
      callback();
    } catch (error) {
      console.error(error);
      callback(error);
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
      callback(error);
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

  handleDisplaySet(data, callback) {
    try {
      windowManager.sendToOverlayWindow(MAIN.DISPLAY_SET, data);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  async sync(socket) {
    try {
      const buttons = await db.getButtons();
      const accelerators = await db.getAccelerators();
      const displays = await db.getDisplays();

      socket.emit(IO_EMIT.BUTTONS_SYNC, { buttons }, ({ broken }) => {
        windowManager.sendToMainWindow(MAIN.BUTTONS_BROKEN, broken);
      });

      socket.emit(IO_EMIT.ACCELERATORS_SYNC, { accelerators }, ({ broken }) => {
        windowManager.sendToMainWindow(MAIN.ACCELERATORS_BROKEN, broken);
      });

      socket.emit(IO_EMIT.DISPLAYS_SYNC, { displays }, ({ broken }) => {
        windowManager.sendToMainWindow(MAIN.DISPLAYS_BROKEN, broken);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async close() {
    return new Promise((resolve) => {
      this.io.close(() => {
        console.log('io:closed');
        resolve();
      });
    });
  }

  getConnected() {
    return [...this.io.sockets.sockets.values()];
  }

  getConnections() {
    return this.getConnected().map((socket) => {
      return {
        id: socket.id,
        socketId: socket.id,
        cloudId: socket.handshake.query.cloudId,
        name: socket.handshake.query.name,
        connected: socket.connected,
      };
    });
  }
}

module.exports = new ServerSocket();

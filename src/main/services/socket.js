const { shell, Notification } = require('electron');
const http = require('http');
const Server = require('socket.io');
const db = require('./db');
const windowManager = require('../managers/windowManager');

const { MAIN, REND, IO_EMIT, IO_ON } = require('../../shared/events');

class ServerSocket {
  constructor() {
    console.log('socket:constructor');
    this.httpServer = http.createServer();
    this.options = {
      path: '/desktop',
      serveClient: false,
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 10e7,
    };

    this.io = new Server(this.httpServer, this.options);

    this.io.use((socket, next) => {
      let handshake = socket.handshake;
      console.log('handshake:', handshake);
      next();
    });

    this.io.on('connect', this.handleConnect.bind(this));

    windowManager.once('main-window-dom-ready', (event) => {
      this.listen();
    });
  }

  listen() {
    if (this.httpServer.listening === false) {
      this.httpServer.listen(3106, () => {
        console.log('listening on *:3106');
      });
    }
  }

  handleConnect(socket) {
    console.log('connect:', socket.id);
    windowManager.send(MAIN.SOCKETS_INIT, this.getConnections());

    socket.on('disconnect', (reason) => {
      console.log('disconnect:', reason);
      windowManager.send(MAIN.SOCKETS_INIT, this.getConnections());
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

    socket.on(IO_ON.BUTTON_RUN_SUCCESS, (args) => {
      console.log(IO_ON.BUTTON_RUN_SUCCESS, args);
    });

    socket.on(IO_ON.BUTTON_RUN_ERROR, (args) => {
      console.log(IO_ON.BUTTON_RUN_ERROR, args);
    });

    socket.on(IO_ON.FLOW_BUTTON_SAVED, (...args) => {
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

      windowManager.send(MAIN.HISTORY_PUSH, historyEntry);
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

      windowManager.send(MAIN.HISTORY_PUSH, historyEntry);
      await shell.openPath(data.path);
      callback();
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }

  handleNotificationShow(args) {
    const notification = new Notification({
      title: args.title != null ? args.title : 'Homey Desktop',
      body: args.body,
      silent: args.silent === 'true',
    });
    notification.show();
  }

  async sync(socket) {
    try {
      const buttons = await db.getButtons();

      const commands = [{ id: 1, name: 'Test' }];

      socket.emit(IO_EMIT.COMMANDS_SYNC, { commands });
      socket.emit(IO_EMIT.BUTTONS_SYNC, { buttons }, ({ broken }) => {
        windowManager.send(MAIN.BUTTONS_BROKEN, broken);
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
    return Object.values(this.io.sockets.connected);
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

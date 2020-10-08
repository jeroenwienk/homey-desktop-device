const { shell, ipcMain } = require('electron');
const http = require('http');
const Server = require('socket.io');
const open = require('open');

const { MAIN, REND, IO_EMIT, IO_ON } = require('../../shared/events');

class Socket {
  constructor() {
    console.log('Socket:constructor');
    this.httpServer = http.createServer();
    this.options = {
      path: '/desktop',
      serveClient: false,
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 10e7,
    };
    this.db = null;

    this.io = new Server(this.httpServer, this.options);

    this.io.use((socket, next) => {
      let handshake = socket.handshake;
      console.log('handshake:', handshake);
      next();
    });

    this.io.on('connect', (socket) => {
      console.log('connect:', socket.id);

      socket.on('disconnect', (reason) => {
        console.log('disconnect:', reason);
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

      socket.on(IO_ON.BUTTON_RUN_SUCCESS, (args) => {
        console.log(IO_ON.BUTTON_RUN_SUCCESS, args);
      });

      socket.on(IO_ON.BUTTON_RUN_ERROR, (args) => {
        console.log(IO_ON.BUTTON_RUN_ERROR, args);
      });

      this.sync(socket);
    });

    this.httpServer.listen(3106, () => {
      console.log('listening on *:3106');
    });
  }

  handleBrowserOpen(data, callback) {
    callback(IO_ON.BROWSER_OPEN_RUN);

    if (this.mainWindow != null) {
      const entry = {
        name: 'browser:open',
        argument: data.url,
        date: new Date(),
      };

      this.db.historyCollection.insert(entry, (error) => {
        if (error) console.error(error);
      });

      this.mainWindow.webContents.send(MAIN.HISTORY_PUSH, entry);
    }

    (async () => {
      await shell.openExternal(data.url);
    })();
  }

  handlePathOpen(data, callback) {
    callback(IO_ON.PATH_OPEN_RUN);

    if (this.mainWindow != null) {
      const entry = {
        name: 'path:open',
        argument: data.path,
        date: new Date(),
      };

      this.db.historyCollection.insert(entry, (error) => {
        if (error) console.error(error);
      });

      this.mainWindow.webContents.send(MAIN.HISTORY_PUSH, entry);
    }

    (async () => {
      await shell.openPath(data.path);
    })();
  }

  async sync(socket) {
    try {
      const buttons = await this.db.getButtons();

      const commands = [{ id: 1, name: 'Test' }];

      socket.emit(IO_EMIT.COMMANDS_SYNC, { commands });
      socket.emit(IO_EMIT.BUTTONS_SYNC, { buttons });
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

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }

  setDataBase(db) {
    this.db = db;
  }
}

module.exports = new Socket();

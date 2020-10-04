const http = require('http');
const Server = require('socket.io');
const open = require('open');
const { shell } = require('electron');

class Socket {
  constructor() {
    this.httpServer = http.createServer();
    this.options = {
      path: '/desktop',
      serveClient: false,
      pingTimeout: 5000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 10e7,
    };

    const io = new Server(this.httpServer, this.options);

    io.use((socket, next) => {
      let handshake = socket.handshake;
      console.log(handshake);
      next();
    });

    const commands = [{ id: 1, name: 'Test' }];

    io.on('connect', (socket) => {
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

      socket.on('run:commands', (data, callback) => {
        callback('running:commands');
        (async () => {
          await open('https://github.com/');
        })();
      });

      socket.on('run:browser:open', (...args) => {
        this.handleBrowserOpen(...args);
      });
      socket.on('run:path:open', (...args) => {
        this.handlePathOpen(...args);
      });

      socket.emit('init:commands', { commands });
    });

    this.httpServer.listen(3106, () => {
      console.log('listening on *:3106');
    });
  }

  handleBrowserOpen(data, callback) {
    callback('run:browser:open');

    if (this.mainWindow != null) {
      this.mainWindow.webContents.send('pushCommand', {
        name: 'browser:open',
        argument: data.url,
      });
    }

    (async () => {
      await shell.openExternal(data.url);
    })();
  }

  handlePathOpen(data, callback) {
    callback('run:path:open');

    if (this.mainWindow != null) {
      this.mainWindow.webContents.send('pushCommand', {
        name: 'path:open',
        argument: data.path,
      });
    }

    (async () => {
      await shell.openPath(data.path);
    })();
  }

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }
}

module.exports = Socket;

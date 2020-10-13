const { ipcMain } = require('electron');
const db = require('./services/db');
const serverSocket = require('./services/socket');

const { REND, MAIN, IO_EMIT, IO_ON } = require('../shared/events');

function init() {
  ipcMain.on(REND.INIT, handleInit);
  ipcMain.on(REND.BUTTON_CREATE, handleButtonCreate);
  ipcMain.on(REND.BUTTON_UPDATE, handleButtonUpdate);
  ipcMain.on(REND.BUTTON_REMOVE, handleButtonRemove);
  ipcMain.on(REND.BUTTON_RUN, handleButtonRun);
}

async function handleInit(event, args) {
  const history = await db.getHistory();
  const buttons = await db.getButtons();
  const connections = serverSocket.getConnections();

  event.reply(MAIN.HISTORY_INIT, history);
  event.reply(MAIN.BUTTONS_INIT, buttons);
  event.reply(MAIN.SOCKETS_INIT, connections);

  serverSocket.getConnected().forEach((socket) => {
    serverSocket.sync(socket);
  });
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
  serverSocket.getConnected().forEach((socket) => {
    socket.emit(
      IO_EMIT.BUTTONS_SYNC,
      {
        buttons,
      },
      ({ broken }) => {
        event.reply(MAIN.BUTTONS_BROKEN, broken);
      }
    );
  });
}

module.exports = { init };

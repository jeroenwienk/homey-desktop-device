const { ipcMain } = require('electron');
const db = require('./services/db');
const socket = require('./services/socket');

const { REND, MAIN, IO_EMIT, IO_ON } = require('../shared/events');

function init() {
  ipcMain.on(REND.INIT, handleInit);
  ipcMain.on(REND.BUTTON_CREATE, handleButtonCreate);
  ipcMain.on(REND.BUTTON_UPDATE, handleButtonUpdate);
  ipcMain.on(REND.BUTTON_RUN, handleButtonRun);
}

async function handleInit(event, args) {
  const history = await db.getHistory();
  const buttons = await db.getButtons();
  const connections = getConnections();

  event.reply(MAIN.HISTORY_INIT, history);
  event.reply(MAIN.BUTTONS_INIT, buttons);
  event.reply(MAIN.SOCKETS_INIT, connections);

  Object.values(socket.io.sockets.connected).forEach((connection) => {
    socket.sync(connection);
  });
}

async function handleButtonCreate(event, args) {
  try {
    await db.insertButton(args);
    const buttons = await db.getButtons();

    Object.values(socket.io.sockets.connected).forEach((socket) => {
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
  } catch (error) {
    console.error(error);
  }
}

async function handleButtonUpdate(event, args) {
  try {
    await db.updateButton(args.id, args);
    const buttons = await db.getButtons();

    Object.values(socket.io.sockets.connected).forEach((socket) => {
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
  } catch (error) {
    console.error(error);
  }
}

function handleButtonRun(event, args) {
  socket.io.emit(IO_EMIT.BUTTON_RUN, args);
}

function getConnections() {
  return Object.entries(socket.io.sockets.connected).reduce(
    (accumulator, [id, socket]) => {
      accumulator[socket.handshake.query.cloudId] = {
        socketId: id,
        cloudId: socket.handshake.query.cloudId,
        name: socket.handshake.query.name,
        connected: socket.connected,
        reason: null,
      };
      return accumulator;
    },
    {}
  );
}

module.exports = { init };

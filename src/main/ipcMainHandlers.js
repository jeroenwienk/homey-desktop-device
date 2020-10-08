const { ipcMain } = require('electron');
const db = require('./services/db');
const socket = require('./services/socket');

const { REND, MAIN, IO_EMIT, IO_ON } = require('../shared/events');

function init() {
  ipcMain.on(REND.INIT, handleInit);
  ipcMain.on(REND.BUTTON_CREATE, handleButtonCreate);
  ipcMain.on(REND.BUTTON_RUN, handleButtonRun);
}

async function handleInit(event, args) {
  const history = await db.getHistory();
  const buttons = await db.getButtons();

  event.reply(MAIN.HISTORY_INIT, history);
  event.reply(MAIN.BUTTONS_INIT, buttons);
}

async function handleButtonCreate(event, args) {
  try {
    await db.insertButton(args);
    const buttons = await db.getButtons();
    socket.io.emit(IO_EMIT.BUTTONS_SYNC, { buttons });
  } catch (error) {
    console.error(error);
  }
}

function handleButtonRun(event, args) {
  socket.io.emit(IO_EMIT.BUTTON_RUN, args);
}

module.exports = { init };

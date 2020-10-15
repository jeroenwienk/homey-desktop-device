const { ipcMain, globalShortcut } = require('electron');
const db = require('./services/db');
const serverSocket = require('./services/serverSocket');

const { REND, MAIN, IO_EMIT, IO_ON } = require('../shared/events');

function init() {
  ipcMain.on(REND.INIT, handleInit);
  ipcMain.on(REND.BUTTON_CREATE, handleButtonCreate);
  ipcMain.on(REND.BUTTON_UPDATE, handleButtonUpdate);
  ipcMain.on(REND.BUTTON_REMOVE, handleButtonRemove);
  ipcMain.on(REND.BUTTON_RUN, handleButtonRun);
  ipcMain.on(REND.ACCELERATOR_CREATE, handleAcceleratorCreate);
  ipcMain.on(REND.ACCELERATOR_UPDATE, handleAcceleratorUpdate);
  ipcMain.on(REND.ACCELERATOR_REMOVE, handleAcceleratorRemove);
  ipcMain.on(REND.ACCELERATOR_RUN, handleAcceleratorRun);
}

async function handleInit(event, args) {
  const history = await db.getHistory();
  const buttons = await db.getButtons();
  const accelerators = await db.getAccelerators();
  const connections = serverSocket.getConnections();

  registerAccelerators(accelerators);

  event.reply(MAIN.HISTORY_INIT, history);
  event.reply(MAIN.BUTTONS_INIT, buttons);
  event.reply(MAIN.ACCELERATORS_INIT, accelerators);
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
  serverSocket.io.emit(IO_EMIT.ACCELERATOR_RUN, args);
}

async function emitAcceleratorsSync(event) {
  const accelerators = await db.getAccelerators();
  registerAccelerators(accelerators);

  serverSocket.getConnected().forEach((socket) => {
    socket.emit(
      IO_EMIT.ACCELERATORS_SYNC,
      {
        accelerators,
      },
      ({ broken }) => {
        event.reply(MAIN.ACCELERATORS_BROKEN, broken);
      }
    );
  });
}

function registerAccelerators(accelerators) {
  globalShortcut.unregisterAll();

  accelerators.forEach((accelerator) => {
    const ret = globalShortcut.register(
      accelerator.keys.replaceAll(' ', '+'),
      () => {
        serverSocket.io.emit(IO_EMIT.ACCELERATOR_RUN, { id: accelerator.id });
      }
    );

    if (!ret) {
      console.log('registration failed');
    }
  });
}

module.exports = { init };

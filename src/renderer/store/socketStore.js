import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN } from '../../shared/events';

export const socketStore = create((set) => ({
  connections: {},
}));

function setConnect(connection) {
  socketStore.setState((prevState) => {
    return {
      connections: {
        ...prevState.connections,
        [connection.cloudId]: connection,
      },
    };
  });
}

function setDisconnect(connection) {
  socketStore.setState((prevState) => {
    return {
      connections: {
        ...prevState.connections,
        [connection.cloudId]: connection,
      },
    };
  });
}

export function initConnections(connections) {
  socketStore.setState({
    connections,
  });
}

ipcRenderer.on(MAIN.SOCKETS_INIT, (event, data) => {
  initConnections(data);
});

ipcRenderer.on(MAIN.SOCKET_CONNECT, (event, data) => {
  setConnect(data);
});

ipcRenderer.on(MAIN.SOCKET_DISCONNECT, (event, data) => {
  setDisconnect(data);
});

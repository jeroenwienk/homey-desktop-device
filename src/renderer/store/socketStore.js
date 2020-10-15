import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN } from '../../shared/events';

export const socketStore = create((set) => ({
  connections: [],
}));

export function initConnections(connections) {
  socketStore.setState({
    connections,
  });
}

ipcRenderer.on(MAIN.SOCKETS_INIT, (event, data) => {
  initConnections(data);
});

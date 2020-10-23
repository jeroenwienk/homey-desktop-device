import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN } from '../../shared/events';

export const connectionStore = create((set) => ({
  list: [],
}));

export function initConnections(connections) {
  connectionStore.setState({
    list: connections,
  });
}

ipcRenderer.on(MAIN.SOCKETS_INIT, (event, data) => {
  initConnections(data);
});

const selectList = (state) => state.list;

export function useConnectionList() {
  return connectionStore(selectList);
}

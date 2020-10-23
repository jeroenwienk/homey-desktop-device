import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN } from '../../shared/events';

export const historyStore = create((set) => ({
  list: [],
}));

export function pushHistory(entry) {
  historyStore.setState((prevState) => {
    return {
      list: [entry, ...prevState.list],
    };
  });
}

export function initHistory(history) {
  historyStore.setState({
    list: history,
  });
}

ipcRenderer.on(MAIN.HISTORY_PUSH, (event, data) => {
  pushHistory(data);
});

ipcRenderer.on(MAIN.HISTORY_INIT, (event, data) => {
  initHistory(data);
});

const selectList = (state) => state.list;

export function useHistoryList() {
  return historyStore(selectList);
}

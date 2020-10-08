import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN } from '../../shared/events';

export const historyStore = create((set) => ({
  history: [],
}));

export function pushHistory(entry) {
  historyStore.setState((prevState) => {
    return {
      history: [entry, ...prevState.history],
    };
  });
}

export function initHistory(history) {
  historyStore.setState({
    history: history,
  });
}

ipcRenderer.on(MAIN.HISTORY_PUSH, (event, data) => {
  pushHistory(data);
});

ipcRenderer.on(MAIN.HISTORY_INIT, (event, data) => {
  initHistory(data);
});

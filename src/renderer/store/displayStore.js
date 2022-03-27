import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const displayStore = create((set) => ({
  list: [],
}));

export function createDisplay(display) {
  ipcRenderer.send(REND.DISPLAY_CREATE, display);
  displayStore.setState((prevState) => {
    return {
      list: [...prevState.list, display],
    };
  });
}

export function editDisplay(display) {
  ipcRenderer.send(REND.DISPLAY_UPDATE, display);
  displayStore.setState((prevState) => {
    const nextDisplays = prevState.list.filter(
      (prevDisplay) => prevDisplay.id !== display.id
    );

    return {
      list: [...nextDisplays, display],
    };
  });
}

export function removeDisplay(display) {
  ipcRenderer.send(REND.DISPLAY_REMOVE, display);
  displayStore.setState((prevState) => {
    const nextDisplays = prevState.list.filter(
      (prevDisplay) => prevDisplay.id !== display.id
    );

    return {
      list: [...nextDisplays],
    };
  });
}

export function initDisplays(displays) {
  displayStore.setState({
    list: displays,
  });
}

ipcRenderer.on(MAIN.DISPLAYS_INIT, (event, data) => {
  initDisplays(data);
});

const selectList = (state) => state.list;

export function useDisplayList() {
  return displayStore(selectList);
}

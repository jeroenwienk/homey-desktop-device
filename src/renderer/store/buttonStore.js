import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const buttonStore = create((set) => ({
  list: [],
}));

export function createButton(button) {
  ipcRenderer.send(REND.BUTTON_CREATE, button);
  buttonStore.setState((prevState) => {
    return {
      list: [...prevState.list, button],
    };
  });
}

export function editButton(button) {
  ipcRenderer.send(REND.BUTTON_UPDATE, button);
  buttonStore.setState((prevState) => {
    const nextButtons = prevState.list.filter(
      (prevButton) => prevButton.id !== button.id
    );

    return {
      list: [...nextButtons, button],
    };
  });
}

export function removeButton(button) {
  ipcRenderer.send(REND.BUTTON_REMOVE, button);
  buttonStore.setState((prevState) => {
    const nextButtons = prevState.list.filter(
      (prevButton) => prevButton.id !== button.id
    );

    return {
      list: [...nextButtons],
    };
  });
}

export function initButtons(buttons) {
  buttonStore.setState({
    list: buttons,
  });
}

ipcRenderer.on(MAIN.BUTTONS_INIT, (event, data) => {
  initButtons(data);
});

const selectList = (state) => state.list;

export function useButtonList() {
  return buttonStore(selectList);
}

import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const buttonStore = create((set) => ({
  buttons: [],
}));

export function pushButton(button) {
  ipcRenderer.send(REND.BUTTON_CREATE, button);
  buttonStore.setState((prevState) => {
    return {
      buttons: [...prevState.buttons, button],
    };
  });
}

export function initButtons(buttons) {
  buttonStore.setState({
    buttons: buttons,
  });
}

ipcRenderer.on(MAIN.BUTTONS_INIT, (event, data) => {
  initButtons(data);
});

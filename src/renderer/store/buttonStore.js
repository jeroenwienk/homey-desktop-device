import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const buttonStore = create((set) => ({
  buttons: [],
  broken: [],
}));

export function pushButton(button) {
  ipcRenderer.send(REND.BUTTON_CREATE, button);
  buttonStore.setState((prevState) => {
    return {
      buttons: [...prevState.buttons, button],
    };
  });
}

export function editButton(button) {
  ipcRenderer.send(REND.BUTTON_UPDATE, button);
  buttonStore.setState((prevState) => {
    const nextButtons = prevState.buttons.filter(
      (prevButton) => prevButton.id !== button.id
    );

    return {
      buttons: [...nextButtons, button],
    };
  });
}

export function removeButton(button) {
  ipcRenderer.send(REND.BUTTON_REMOVE, button);
  buttonStore.setState((prevState) => {
    const nextButtons = prevState.buttons.filter(
      (prevButton) => prevButton.id !== button.id
    );

    return {
      buttons: [...nextButtons],
    };
  });
}

export function initButtons(buttons) {
  buttonStore.setState({
    buttons: buttons,
  });
}

export function initBroken(broken) {
  console.log(broken);

  buttonStore.setState({
    broken: broken,
  });
}

ipcRenderer.on(MAIN.BUTTONS_INIT, (event, data) => {
  initButtons(data);
});

ipcRenderer.on(MAIN.BUTTONS_BROKEN, (event, data) => {
  initBroken(data);
});

import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const inputStore = create((set) => ({
  list: [],
}));

export function createInput(input) {
  ipcRenderer.send(REND.INPUT_CREATE, input);
  inputStore.setState((prevState) => {
    return {
      list: [...prevState.list, input],
    };
  });
}

export function editInput(input) {
  ipcRenderer.send(REND.INPUT_UPDATE, input);
  inputStore.setState((prevState) => {
    const nextInputs = prevState.list.filter(
      (prevInput) => prevInput.id !== input.id
    );

    return {
      list: [...nextInputs, input],
    };
  });
}

export function removeInput(input) {
  ipcRenderer.send(REND.INPUT_REMOVE, input);
  inputStore.setState((prevState) => {
    const nextInputs = prevState.list.filter(
      (prevInput) => prevInput.id !== input.id
    );

    return {
      list: [...nextInputs],
    };
  });
}

export function initInputs(inputs) {
  inputStore.setState({
    list: inputs,
  });
}

ipcRenderer.on(MAIN.INPUTS_INIT, (event, data) => {
  initInputs(data);
});

const selectList = (state) => state.list;

export function useInputList() {
  return inputStore(selectList);
}

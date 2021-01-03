import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const acceleratorStore = create((set) => ({
  list: [],
  broken: [],
}));

export function createAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_CREATE, accelerator);
  acceleratorStore.setState((prevState) => {
    return {
      list: [...prevState.list, accelerator],
    };
  });
}

export function editAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_UPDATE, accelerator);
  acceleratorStore.setState((prevState) => {
    const nextAccelerators = prevState.list.filter(
      (prevAccelerator) => prevAccelerator.id !== accelerator.id
    );

    return {
      list: [...nextAccelerators, accelerator],
    };
  });
}

export function removeAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_REMOVE, accelerator);
  acceleratorStore.setState((prevState) => {
    const nextAccelerators = prevState.list.filter(
      (prevAccelerator) => prevAccelerator.id !== accelerator.id
    );

    return {
      list: [...nextAccelerators],
    };
  });
}

export function initAccelerators(accelerators) {
  acceleratorStore.setState({
    list: accelerators,
  });
}

export function initBroken(broken) {
  acceleratorStore.setState({
    broken: broken,
  });
}

ipcRenderer.on(MAIN.ACCELERATORS_INIT, (event, data) => {
  initAccelerators(data);
});

ipcRenderer.on(MAIN.ACCELERATORS_BROKEN, (event, data) => {
  initBroken(data);
});

const selectList = (state) => state.list;

export function useAcceleratorList() {
  return acceleratorStore(selectList);
}

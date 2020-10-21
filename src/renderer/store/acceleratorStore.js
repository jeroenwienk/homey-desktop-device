import { ipcRenderer } from 'electron';
import create from 'zustand';

import { REND, MAIN } from '../../shared/events';

export const acceleratorStore = create((set) => ({
  accelerators: [],
  broken: [],
}));

export function createAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_CREATE, accelerator);
  acceleratorStore.setState((prevState) => {
    return {
      accelerators: [...prevState.accelerators, accelerator],
    };
  });
}

export function editAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_UPDATE, accelerator);
  acceleratorStore.setState((prevState) => {
    const nextAccelerators = prevState.accelerators.filter(
      (prevAccelerator) => prevAccelerator.id !== accelerator.id
    );

    return {
      accelerators: [...nextAccelerators, accelerator],
    };
  });
}

export function removeAccelerator(accelerator) {
  ipcRenderer.send(REND.ACCELERATOR_REMOVE, accelerator);
  acceleratorStore.setState((prevState) => {
    const nextAccelerators = prevState.accelerators.filter(
      (prevAccelerator) => prevAccelerator.id !== accelerator.id
    );

    return {
      accelerators: [...nextAccelerators],
    };
  });
}

export function initAccelerators(accelerators) {
  acceleratorStore.setState({
    accelerators: accelerators,
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

import { ipcRenderer } from 'electron';
import create from 'zustand';

import { MAIN, REND } from "../../shared/events";

export const settingStore = create((set) => ({}));

export function setSettings(settings) {
  ipcRenderer.send(REND.SETTINGS_UPDATE, settings);
  settingStore.setState((prevState) => {
    return {
      ...settings,
    };
  });
}

export function initSettings(settings) {
  settingStore.setState({
    ...settings,
  });
}

ipcRenderer.on(MAIN.SETTINGS_SET, (event, data) => {
  setSettings(data);
});

ipcRenderer.on(MAIN.SETTINGS_INIT, (event, data) => {
  initSettings(data);
});

const selectSettings = (state) => state;

export function useSettings() {
  return settingStore(selectSettings);
}

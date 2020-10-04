import { ipcRenderer } from 'electron';
import create from 'zustand';

export const historyStore = create((set) => ({
  commands: [],
}));

export function pushCommand(command) {
  historyStore.setState((prevState) => {
    return {
      commands: [...prevState.commands, command],
    };
  });
}

export function initCommands(commands) {
  historyStore.setState({
    commands: commands,
  });
}

ipcRenderer.on('push:command', (event, data) => {
  pushCommand(data);
});

ipcRenderer.on('init:commands', (event, data) => {
  initCommands(data);
});

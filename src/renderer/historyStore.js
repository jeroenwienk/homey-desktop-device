import { ipcRenderer } from 'electron';
import create from 'zustand';

export const historyStore = create((set) => ({
  commands: [],
  pushCommand: (nextCommand) =>
    set((state) => ({ commands: [...state.commands, nextCommand] })),
}));

export function pushCommand(command) {
  const state = historyStore.getState();

  historyStore.setState({
    commands: [...state.commands, command],
  });
}

ipcRenderer.on('pushCommand', (event, data) => {
  pushCommand(data);
});

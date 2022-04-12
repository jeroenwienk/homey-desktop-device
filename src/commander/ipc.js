import { ipcRenderer } from 'electron';
import { events } from '../shared/events';

export const ipc = new (class IPC {
  constructor() {
    ipcRenderer.on(events.ON_MAIN_PROCESS_MESSAGE, (event, args) => {
      // eslint-disable-next-line
      const { message, data } = args;
    });
  }

  async send({ message, data = {} }) {
    return ipcRenderer.invoke(events.ON_COMMANDER_WINDOW_MESSAGE, {
      message: message,
      data: data,
    });
  }
})();

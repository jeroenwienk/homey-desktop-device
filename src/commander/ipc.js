import { ipcRenderer } from 'electron';
import { events } from '../shared/events';

export const ipc = new (class IPC {

  async send({ message, data = {} }) {
    return ipcRenderer.invoke(events.ON_COMMANDER_WINDOW_MESSAGE, {
      message: message,
      data: data,
    });
  }
})();

import { defaultTextValueSort } from '../defaultTextValueSort';

import { ipc } from '../ipc';
import { consoleManager } from '../Console';

export function makeSystemSections({ value }) {
  const baseKey = `system`;

  const close = {
    key: `${baseKey}-close`,
    textValue: `Close`,
    hint: `Close window`,
    filter: ``,
    action() {
      ipc.send({ message: 'close' }).catch((error) => {
        consoleManager.addError(error);
      });
    },
  };

  const path = {
    key: `${baseKey}-path`,
    textValue: `Path`,
    hint: `Open path`,
    filter: ``,
    action({ input }) {
      ipc
        .send({
          message: 'openPath',
          data: {
            path: input,
          },
        })
        .then((result) => {
          return ipc.send({ message: 'close' });
        })
        .catch((error) => {
          consoleManager.addError(error);
        });
    },
  };

  const external = {
    key: `${baseKey}-external`,
    textValue: `External`,
    hint: `Open external`,
    filter: `url`,
    action({ input }) {
      ipc
        .send({
          message: 'openExternal',
          data: {
            url: input,
          },
        })
        .then((result) => {
          return ipc.send({ message: 'close' });
        })
        .catch((error) => {
          consoleManager.addError(error);
        });
    },
  };

  const webApp = {
    key: `${baseKey}-web-app`,
    textValue: `Web App`,
    hint: `Open Web App window`,
    filter: `open web app`,
    action({ input }) {
      ipc
        .send({
          message: 'openWebAppWindow',
          data: {},
        })
        .then((result) => {
          return ipc.send({ message: 'close' });
        })
        .catch((error) => {
          consoleManager.addError(error);
        });
    },
  };

  return {
    sections: [
      {
        key: baseKey,
        title: 'System',
        children: [close, path, external, webApp].sort(defaultTextValueSort),
      },
    ],
  };
}

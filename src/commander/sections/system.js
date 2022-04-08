import { defaultTextValueSort } from '../defaultTextValueSort';

import { ipc } from '../ipc';

export function makeSystemSections({ value }) {
  const baseKey = `system`;

  const close = {
    key: `${baseKey}-close`,
    type: 'system',
    textValue: `Close`,
    hint: `Close window`,
    filter: ``,
    action() {
      ipc.send({ message: 'close' });
    },
  };

  const path = {
    key: `${baseKey}-path`,
    type: 'system',
    textValue: `Path`,
    hint: `Open path`,
    filter: ``,
    inputAction({ input }) {
      ipc
        .send({
          message: 'openPath',
          data: {
            path: input,
          },
        })
        .then((result) => {
          console.log(result);
          return ipc.send({ message: 'close' });
        })
        .catch(console.error);
    },
  };

  const external = {
    key: `${baseKey}-external`,
    type: 'system',
    textValue: `External`,
    hint: `Open external`,
    filter: `url`,
    inputAction({ input }) {
      ipc
        .send({
          message: 'openExternal',
          data: {
            url: input,
          },
        })
        .then((result) => {
          console.log(result);
          return ipc.send({ message: 'close' });
        })
        .catch(console.error);
    },
  };

  return {
    sections: [
      {
        key: baseKey,
        title: 'System',
        children: [close, path, external].sort(defaultTextValueSort),
      },
    ],
  };
}

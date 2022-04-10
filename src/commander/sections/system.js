import { defaultTextValueSort } from '../defaultTextValueSort';

import { ipc } from '../ipc';

export function makeSystemSections({ value }) {
  const baseKey = `system`;

  const close = {
    key: `${baseKey}-close`,
    textValue: `Close`,
    hint: `Close window`,
    filter: ``,
    action() {
      ipc.send({ message: 'close' });
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
          console.log(result);
          return ipc.send({ message: 'close' });
        })
        .catch(console.error);
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

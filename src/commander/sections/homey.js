import { v4 as uuid } from 'uuid';

import { defaultTextValueSort } from '../defaultTextValueSort';
import { ipc } from '../ipc';

export function makeHomeySections({ value }) {
  const baseKey = `${value.key}-homey`;

  const keys = {
    open: `${baseKey}-open`,
  };

  function openInWindowAction({ subPath, state } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const path = `/homeys/${value.homey.id}${subPath ?? ''}`;

          await ipc.send({
            message: 'openInWindow',
            data: {
              path,
              state,
            },
          });
          await ipc.send({ message: 'close' });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.error);
  }

  function openInBrowserAction({ subPath, state } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const url = `https://my.homey.app/homeys/${value.homey.id}${subPath ?? ''}`;

          await ipc.send({
            message: 'openInBrowser',
            data: {
              url,
              state,
            },
          });
          await ipc.send({ message: 'close' });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.error);
  }

  return {
    sections: [
      {
        key: keys.open,
        title: 'Open',
        children: [
          {
            key: `${keys.open}-home`,
            textValue: 'Home',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction();
              } else {
                openInWindowAction();
              }
            },
          },
          {
            key: `${keys.open}-devices`,
            textValue: 'Devices',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/devices' });
              } else {
                openInWindowAction({ subPath: '/devices' });
              }
            },
          },
          {
            key: `${keys.open}-flows`,
            textValue: 'Flows',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/flows' });
              } else {
                openInWindowAction({ subPath: '/flows' });
              }
            },
          },
          {
            key: `${keys.open}-insights`,
            textValue: 'Insights',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/insights' });
              } else {
                openInWindowAction({ subPath: '/insights' });
              }
            },
          },
          {
            key: `${keys.open}-homey-script`,
            textValue: 'HomeyScript',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/script' });
              } else {
                openInWindowAction({ subPath: '/script' });
              }
            },
          },
          {
            key: `${keys.open}-new-device`,
            textValue: 'New Device',
            hint: 'open in window (no browser support yet)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ state: { pairDialog: { type: 'pair' } } });
              } else {
                openInWindowAction({ state: { pairDialog: { type: 'pair' } } });
              }
            },
          },
          {
            key: `${keys.open}-new-flow`,
            textValue: 'New Flow',
            hint: 'open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: `/flows/create?id=${uuid()}` });
              } else {
                openInWindowAction({ subPath: `/flows/create?id=${uuid()}` });
              }
            },
          },
        ].sort(defaultTextValueSort),
      },
    ],
  };
}

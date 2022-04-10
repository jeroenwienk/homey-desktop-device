import { defaultTextValueSort } from '../defaultTextValueSort';
import { ipc } from '../ipc';

export function makeHomeySections({ value }) {
  const baseKey = `${value.key}-homey`;
  console.log(value);

  function openInWindowAction({ subPath } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const path = `/homeys/${value.homey.id}${subPath ?? ''}`;

          await ipc.send({
            message: 'openInWindow',
            data: {
              path,
            },
          });
          await ipc.send({ message: 'close' });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.error);
  }

  function openInBrowserAction({ subPath } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const url = `https://my.homey.app/homeys/${value.homey.id}${subPath ?? ''}`;

          await ipc.send({
            message: 'openInBrowser',
            data: {
              url,
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
        key: `${baseKey}-general`,
        title: 'General',
        children: [
          {
            key: `${baseKey}-home`,
            textValue: 'Home',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction();
              } else {
                openInWindowAction();
              }
            },
          },
          {
            key: `${baseKey}-open-devices`,
            textValue: 'Devices',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/devices' });
              } else {
                openInWindowAction({ subPath: '/devices' });
              }
            },
          },
          {
            key: `${baseKey}-open-flows`,
            textValue: 'Flows',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/flows' });
              } else {
                openInWindowAction({ subPath: '/flows' });
              }
            },
          },
          {
            key: `${baseKey}-open-insights`,
            textValue: 'Insights',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/insights' });
              } else {
                openInWindowAction({ subPath: '/insights' });
              }
            },
          },
          {
            key: `${baseKey}-open-homey-script`,
            textValue: 'HomeyScript',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openInBrowserAction({ subPath: '/script' });
              } else {
                openInWindowAction({ subPath: '/script' });
              }
            },
          },
        ].sort(defaultTextValueSort),
      },
    ],
  };
}

import { defaultTextValueSort } from '../defaultTextValueSort';
import { ipc } from '../ipc';

function makeHint(capability) {
  switch (capability.type) {
    case 'number':
      return `${capability.type}, min ${capability.min ?? '-'}, max ${
        capability.max ?? '-'
      }, step ${capability.step ?? '-'}`;
    default:
      return capability.type;
  }
}

function makeDescription(capability) {
  switch (capability.type) {
    case 'enum':
      return JSON.stringify(capability.values, null, 2); //<pre>{JSON.stringify(capability.values, null, 2)}</pre>;
    default:
      return null;
  }
}

export function makeDeviceSections({ value }) {
  const baseKey = `${value.key}-device`;

  console.log(value);

  return {
    sections: [
      {
        key: `${baseKey}-general`,
        title: 'General',
        children: [
          {
            key: `open-browser`,
            textValue: 'Open',
            hint: 'Open in browser',
            action() {
              Promise.resolve()
                .then(async () => {
                  try {
                    await ipc.send({
                      message: 'openDeviceInBrowser',
                      data: {
                        homeyId: value.device.homey.id,
                        deviceId: value.device.id,
                      },
                    });
                    await ipc.send({ message: 'close' });
                  } catch (error) {
                    console.log(error);
                  }
                })
                .catch(console.error);
            },
          },
          {
            key: `open-window`,
            textValue: 'Open',
            hint: 'Open in window',
            action() {
              Promise.resolve()
                .then(async () => {
                  try {
                    await ipc.send({
                      message: 'openDeviceInWindow',
                      data: {
                        homeyId: value.device.homey.id,
                        deviceId: value.device.id,
                      },
                    });
                    await ipc.send({ message: 'close' });
                  } catch (error) {
                    console.log(error);
                  }
                })
                .catch(console.error);
            },
          }
        ].sort(defaultTextValueSort),
      },
      {
        key: `${baseKey}-capabilities`,
        title: 'Capabilities',
        children: Object.entries(value.device.capabilitiesObj)
          .map(([capabilityId, capability]) => {
            return {
              key: `${value.key}-device-${capabilityId}`,
              type: 'capability',
              textValue: capability.title,
              filter: `${capability.id} ${capability.type}`,
              hint: makeHint(capability),
              description: makeDescription(capability),
              device: value.device,
              capability,
            };
          })
          .sort(defaultTextValueSort),
      },
    ],
  };
}

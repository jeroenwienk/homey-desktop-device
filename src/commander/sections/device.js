import { defaultTextValueSort } from '../defaultTextValueSort';
import { ipc } from '../ipc';
import { store } from '../CommanderApp';
import { consoleManager } from '../Console';

export function makeDeviceSections({ value }) {
  const baseKey = `${value.key}-device`;

  const settingsSubPath = `?dialog=device-settings&key=${value.device.id}`;

  function openDeviceInWindowAction({ subPath } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const path = `/homeys/${value.device.homey.id}/devices/${value.device.id}${subPath ?? ''}`;

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

  function openDeviceInBrowserAction({ subPath } = {}) {
    Promise.resolve()
      .then(async () => {
        try {
          const url = `https://my.homey.app/homeys/${value.device.homey.id}/devices/${value.device.id}${subPath ?? ''}`;

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

  function openAppInBrowserAction() {
    Promise.resolve()
      .then(async () => {
        try {
          // TODO
          // throw or dont show option on virtual devices

          const appId = value.device.driverUri?.substring('homey:app:'.length);
          const url = `https://homey.app/a/${appId}`;

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

  const keys = {
    general: `${baseKey}-general`,
    copy: `${baseKey}-copy`,
    capabilities: `${baseKey}-capabilities`,
  };

  return {
    sections: [
      {
        key: keys.general,
        title: 'General',
        children: [
          {
            key: `${keys.general}-controls`,
            textValue: 'Controls',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openDeviceInBrowserAction();
              } else {
                openDeviceInWindowAction();
              }
            },
          },
          {
            key: `${keys.general}-settings`,
            textValue: 'Settings',
            hint: 'Open in window (!b for browser)',
            action({ input }) {
              if (input === 'b') {
                openDeviceInBrowserAction({ subPath: settingsSubPath });
              } else {
                openDeviceInWindowAction({ subPath: settingsSubPath });
              }
            },
          },
          {
            key: `${keys.general}-app`,
            textValue: 'App',
            hint: 'Open in browser (app store)',
            action({ input }) {
              openAppInBrowserAction();
            },
          },
        ].sort(defaultTextValueSort),
      },
      {
        key: keys.copy,
        title: 'Copy',
        children: [
          {
            key: `${keys.copy}-id`,
            textValue: 'ID',
            filter: 'copy id',
            hint: 'clipboard',
            action() {
              Promise.resolve()
                .then(async () => {
                  try {
                    await ipc.send({
                      message: 'writeJSONPathToClipBoard',
                      data: {
                        path: '$.id',
                        value: value.device,
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
            key: `${keys.copy}-json`,
            textValue: 'JSON',
            filter: 'copy json',
            hint: 'clipboard',
            action() {
              Promise.resolve()
                .then(async () => {
                  try {
                    await ipc.send({
                      message: 'writeJSONPathToClipBoard',
                      data: {
                        path: '$',
                        value: value.device,
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
            key: `${keys.copy}-json-path`,
            type: 'jsonpath',
            textValue: 'Path',
            filter: 'copy path',
            hint: 'json path to clipboard',
            action({ input }) {
              Promise.resolve()
                .then(async () => {
                  try {
                    await ipc.send({
                      message: 'writeJSONPathToClipBoard',
                      data: {
                        path: input,
                        value: value.device,
                      },
                    });
                    await ipc.send({ message: 'close' });
                  } catch (error) {
                    console.log(error);
                  }
                })
                .catch(console.error);
            },
            device: value.device, // passing for jsonpath type
          },
        ].sort(defaultTextValueSort),
      },
      makeCapabilitiesSection({ key: keys.capabilities, value }),
    ],
  };
}

function makeHint(capability) {
  switch (capability.type) {
    case 'number':
      if (capability.setable) {
        return `${capability.type}, min ${capability.min ?? '-'}, max ${capability.max ?? '-'}, step ${
          capability.step ?? '-'
        }`;
      }
      break;
    case 'enum':
      return capability.values.map((value) => value.id).join(',');
    default:
      return capability.type;
  }
}

function makeDescription(capability) {
  switch (capability.type) {
    default:
      return null;
  }
}

function makeCapabilitiesSection({ key, value }) {
  const device = value.device;

  function setCapabilityValue({ capability, input }) {
    let parsedValue = null;
    const inputAsNum = Number(input);

    switch (true) {
      case capability.type === 'number':
        parsedValue = Number(input);
        break;
      case capability.type === 'string':
        parsedValue = String(input);
        break;
      case capability.type === 'boolean':
        if (Number.isNaN(inputAsNum)) {
          parsedValue = input === 'true';
        } else {
          parsedValue = Boolean(inputAsNum);
        }

        break;
      default:
        parsedValue = input;
        break;
    }

    store.getState().incrementLoadingCount();
    device
      .setCapabilityValue({
        capabilityId: capability.id,
        value: parsedValue,
      })
      .then(console.log)
      .catch((error) => consoleManager.addError(error))
      .finally(() => {
        store.getState().decrementLoadingCount();
      });
  }

  const capabilitiesObjEntries = Object.entries(value.device.capabilitiesObj ?? {});

  function mapCapability([capabilityId, capability]) {
    return {
      key: `${key}-${capabilityId}`,
      type: 'capability',
      textValue: capability.title,
      filter: `${capability.id} ${capability.type}`,
      hint: makeHint(capability),
      description: makeDescription(capability),
      inputModeHint: '! for input mode or enter to dive into',
      context: {
        device: device,
        capability: capability,
      },
      action({ input }) {
        setCapabilityValue({ capability, input });
      },
    };
  }

  return {
    key: key,
    title: 'Capabilities',
    children: capabilitiesObjEntries.map(mapCapability).sort(defaultTextValueSort),
  };
}

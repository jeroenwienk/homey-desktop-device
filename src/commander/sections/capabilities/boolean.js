import { store } from '../../CommanderApp';
import { consoleManager } from "../../Console";

export function makeBooleanCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  const toggle = {
    key: `${baseKey}-toggle`,
    textValue: 'Toggle',
    action() {
      store.getState().incrementLoadingCount();
      device.homey.devices
        .getDevice({ id: device.id })
        .then((device) => {
          return device.setCapabilityValue({
            capabilityId: capability.id,
            value: device.capabilitiesObj[capability.id].value !== true,
          });
        })
        .then(console.log)
        .catch((error) => consoleManager.addError(error))
        .finally(() => {
          store.getState().decrementLoadingCount();
        });
    },
  };

  const on = {
    key: `${baseKey}-true`,
    textValue: 'On',
    action() {
      store.getState().incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: true,
        })
        .catch(console.log)
        .finally(() => {
          store.getState().decrementLoadingCount();
        });
    },
  };

  const off = {
    key: `${baseKey}-false`,
    textValue: 'Off',
    action() {
      store.getState().incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: false,
        })
        .catch(console.log)
        .finally(() => {
          store.getState().decrementLoadingCount();
        });
    },
  };

  return [
    {
      key: baseKey,
      title: 'Capability',
      children: [toggle, on, off],
    },
  ];
}

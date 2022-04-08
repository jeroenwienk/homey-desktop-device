import { store } from '../../CommanderApp';

export function makeBooleanCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;

  const toggle = {
    key: `${baseKey}-toggle`,
    type: 'action',
    textValue: 'Toggle',
    action() {
      store.getState().incrementLoadingCount();
      value.device.homey.devices
        .getDevice({ id: value.device.id })
        .then((device) => {
          return value.device.setCapabilityValue({
            capabilityId: value.capability.id,
            value: device.capabilitiesObj[value.capability.id].value !== true,
          });
        })
        .then(console.log)
        .catch(console.log)
        .finally(() => {
          store.getState().decrementLoadingCount();
        });
    },
  };

  const on = {
    key: `${baseKey}-true`,
    type: 'action',
    textValue: 'On',
    action() {
      store.getState().incrementLoadingCount();

      value.device
        .setCapabilityValue({
          capabilityId: value.capability.id,
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
    type: 'action',
    textValue: 'Off',
    action() {
      store.getState().incrementLoadingCount();

      value.device
        .setCapabilityValue({
          capabilityId: value.capability.id,
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

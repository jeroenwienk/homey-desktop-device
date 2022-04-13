import { commanderManager } from '../../CommanderApp';
import { consoleManager } from '../../Console';

export function makeBooleanCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  const toggle = {
    key: `${baseKey}-toggle`,
    textValue: 'Toggle',
    action() {
      commanderManager.incrementLoadingCount();
      device.homey.devices
        .getDevice({ id: device.id })
        .then((device) => {
          return device.setCapabilityValue({
            capabilityId: capability.id,
            value: device.capabilitiesObj[capability.id].value !== true,
          });
        })
        .then(() => {})
        .catch((error) => consoleManager.addError(error))
        .finally(() => {
          commanderManager.decrementLoadingCount();
        });
    },
  };

  const on = {
    key: `${baseKey}-true`,
    textValue: 'On',
    action() {
      commanderManager.incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: true,
        })
        .then(() => {})
        .finally(() => {
          commanderManager.decrementLoadingCount();
        });
    },
  };

  const off = {
    key: `${baseKey}-false`,
    textValue: 'Off',
    action() {
      commanderManager.incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: false,
        })
        .then(() => {})
        .finally(() => {
          commanderManager.decrementLoadingCount();
        });
    },
  };

  return [
    {
      key: baseKey,
      title: capability.title,
      children: [toggle, on, off],
    },
  ];
}

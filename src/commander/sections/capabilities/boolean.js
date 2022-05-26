import { commander } from '../../CommanderApp';
import { consoleManager } from '../../Console';

export function makeBooleanCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  const toggle = {
    key: `${baseKey}-toggle`,
    textValue: 'Toggle',
    action() {
      commander.incrementLoadingCount();
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
          commander.decrementLoadingCount();
        });
    },
  };

  const on = {
    key: `${baseKey}-true`,
    textValue: 'On',
    action() {
      commander.incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: true,
        })
        .then(() => {})
        .catch((error) => consoleManager.addError(error))
        .finally(() => {
          commander.decrementLoadingCount();
        });
    },
  };

  const off = {
    key: `${baseKey}-false`,
    textValue: 'Off',
    action() {
      commander.incrementLoadingCount();

      device
        .setCapabilityValue({
          capabilityId: capability.id,
          value: false,
        })
        .then(() => {})
        .catch((error) => consoleManager.addError(error))
        .finally(() => {
          commander.decrementLoadingCount();
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

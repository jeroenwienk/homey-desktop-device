export function makeBooleanCapabilitySection({ value }) {
  const toggle = {
    key: 'toggle',
    type: 'action',
    textValue: 'Toggle',
    action() {
      value.device.homey.devices
        .getDevice({ id: value.device.id })
        .then((device) => {
          value.device
            .setCapabilityValue({
              capabilityId: value.capability.id,
              value: device.capabilitiesObj[value.capability.id].value !== true,
            })
            .catch(console.log);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  };

  const on = {
    key: 'true',
    type: 'action',
    textValue: 'On',
    action() {
      value.device
        .setCapabilityValue({
          capabilityId: value.capability.id,
          value: true,
        })
        .catch(console.log);
    },
  };

  const off = {
    key: 'false',
    type: 'action',
    textValue: 'Off',
    action() {
      value.device
        .setCapabilityValue({
          capabilityId: value.capability.id,
          value: false,
        })
        .catch(console.log);
    },
  };

  return [
    {
      key: 'capability',
      title: 'Capability',
      children: [toggle, on, off],
    },
  ];
}

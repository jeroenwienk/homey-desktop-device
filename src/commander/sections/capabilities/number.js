export function makeNumberCapabilitySection({ value }) {
  function action({ input }) {
    value.device
      .setCapabilityValue({
        capabilityId: value.capability.id,
        value: parseFloat(input),
      })
      .catch(console.log);
  }

  const toggle = {
    key: 'set',
    type: 'action',
    textValue: 'Set',
    hint: `min ${value.capability.min ?? '-'}, max ${
      value.capability.max ?? '-'
    }, step ${value.capability.step ?? '-'}`,
    action: action, // maybe log that action requires an input?
    inputAction: action,
  };

  // const on = {
  //   key: 'true',
  //   type: 'action',
  //   textValue: 'On',
  //   action() {
  //     value.device
  //       .setCapabilityValue({
  //         capabilityId: value.capability.id,
  //         value: true,
  //       })
  //       .catch(console.log);
  //   },
  // };
  //
  // const off = {
  //   key: 'false',
  //   type: 'action',
  //   textValue: 'Off',
  //   action() {
  //     value.device
  //       .setCapabilityValue({
  //         capabilityId: value.capability.id,
  //         value: false,
  //       })
  //       .catch(console.log);
  //   },
  // };

  return [
    {
      key: 'capability',
      title: 'Capability',
      children: [toggle],
    },
  ];
}

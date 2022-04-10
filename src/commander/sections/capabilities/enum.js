import { store } from '../../CommanderApp';

export function makeEnumCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;

  function action({ input }) {
    // maybe log that action requires an input?
    store.getState().incrementLoadingCount();
    value.device
      .setCapabilityValue({
        capabilityId: value.capability.id,
        value: input,
      })
      .catch(console.log)
      .finally(() => {
        store.getState().decrementLoadingCount();
      });
  }

  const set = {
    key: `${baseKey}-set`,
    textValue: 'Set',
    description: JSON.stringify(value.capability.values, null, 2),
    action: action,
  };

  return [
    {
      key: baseKey,
      title: 'Capability',
      children: [set],
    },
  ];
}

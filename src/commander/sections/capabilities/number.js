import { store } from '../../CommanderApp';

export function makeNumberCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;

  function action({ input }) {
    // maybe log that action requires an input?
    store.getState().incrementLoadingCount();
    value.device
      .setCapabilityValue({
        capabilityId: value.capability.id,
        value: parseFloat(input),
      })
      .catch(console.log)
      .finally(() => {
        store.getState().decrementLoadingCount();
      });
  }

  const set = {
    key: `${baseKey}-set`,
    textValue: 'Set',
    hint: `min ${value.capability.min ?? '-'}, max ${value.capability.max ?? '-'}, step ${
      value.capability.step ?? '-'
    }`,
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

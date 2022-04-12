import { store } from '../../CommanderApp';
import { consoleManager } from '../../Console';

export function makeStringCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  function action({ input }) {
    // maybe log that action requires an input?

    store.getState().incrementLoadingCount();
    device
      .setCapabilityValue({
        capabilityId: capability.id,
        value: input,
      })
      .then(console.log)
      .catch((error) => consoleManager.addError(error))
      .finally(() => {
        store.getState().decrementLoadingCount();
      });
  }

  const set = {
    key: `${baseKey}-set`,
    textValue: 'Set',
    hint: ``,
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

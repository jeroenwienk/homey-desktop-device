import { commanderManager } from '../../CommanderApp';
import { consoleManager } from '../../Console';

export function makeEnumCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  function action({ input }) {
    // maybe log that action requires an input?
    commanderManager.incrementLoadingCount();
    device
      .setCapabilityValue({
        capabilityId: capability.id,
        value: input,
      })
      .then(() => {})
      .catch((error) => consoleManager.addError(error))
      .finally(() => {
        commanderManager.decrementLoadingCount();
      });
  }

  const set = {
    key: `${baseKey}-set`,
    textValue: 'Set',
    // description: JSON.stringify(value.capability.values, null, 2),
    hint: capability.values.map((value) => value.id).join(','),
    action: action,
  };

  return [
    {
      key: baseKey,
      title: capability.title,
      children: [set],
    },
  ];
}

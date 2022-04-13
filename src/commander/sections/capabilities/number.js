import { commanderManager } from '../../CommanderApp';
import { consoleManager } from "../../Console";

export function makeNumberCapabilitySection({ value }) {
  const baseKey = `${value.key}-capability`;
  const { device, capability } = value.context;

  function action({ input }) {
    // maybe log that action requires an input?
    commanderManager.incrementLoadingCount();
    device
      .setCapabilityValue({
        capabilityId: capability.id,
        value: parseFloat(input),
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
    hint: `min ${capability.min ?? '-'}, max ${capability.max ?? '-'}, step ${capability.step ?? '-'}`,
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

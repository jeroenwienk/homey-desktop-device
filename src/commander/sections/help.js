import { defaultTextValueSort } from '../defaultTextValueSort';

export function makeHelpSections({ value }) {
  const baseKey = `help`;

  const inputMode = {
    key: `${baseKey}-input-mode`,
    type: 'help',
    textValue: `Input mode`,
    hint: `!`,
    description:
      'Use ! to put the input in submit mode. When an item has an action and it is selected' +
      ' this will directly pass the currently typed value to the action of the command.' +
      ' If the item has no action it will just select it instead.',
    filter: ``,
    selectable: false,
  };

  return {
    sections: [
      {
        key: baseKey,
        title: 'Help',
        children: [inputMode].sort(defaultTextValueSort),
      },
    ],
  };
}

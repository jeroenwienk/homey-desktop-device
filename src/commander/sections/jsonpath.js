// import { defaultTextValueSort } from '../defaultTextValueSort';
import { ipc } from '../ipc';
import { consoleManager } from '../Console';

export function makeJSONPathSections({ value }) {
  const baseKey = `${value.key}-jsonpath`;

  const run = {
    key: `${baseKey}-run`,
    textValue: 'Run',
    filter: 'run',
    hint: '',
    action({ input }) {
      Promise.resolve()
        .then(async () => {
          await ipc.send({
            message: 'writeJSONPathToClipBoard',
            data: {
              path: input,
              value: value.device,
            },
          });
          await ipc.send({ message: 'close' });
        })
        .catch((error) => {
          consoleManager.addError(error);
        });
    },
  };

  const syntax = {
    key: `${baseKey}-syntax`,
    textValue: `JSONPath Syntax`,
    hint: ``,
    description:
      'Allows you to get a property from an object with the jsonpath syntax.' +
      " For example on a device '$.id' or 'id' would return the 'id' of the device." +
      " 'capabilities[0]' the value in capabilities on the first index.",
    filter: ``,
  };

  const reference = {
    key: `${baseKey}-referece`,
    textValue: `Reference`,
    hint: `open in browser`,
    filter: ``,
    action() {
      Promise.resolve()
        .then(async () => {
          const url = `https://github.com/dchester/jsonpath`;

          await ipc.send({
            message: 'openInBrowser',
            data: {
              url,
            },
          });
          await ipc.send({ message: 'close' });
        })
        .catch((error) => {
          consoleManager.addError(error);
        });
    },
  };

  return {
    sections: [
      {
        key: baseKey,
        title: 'Help',
        children: [run, syntax, reference], // .sort(defaultTextValueSort),
      },
    ],
  };
}

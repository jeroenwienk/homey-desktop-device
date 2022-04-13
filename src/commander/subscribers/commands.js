import { useEffect } from 'react';

import { debounce } from '../../shared/debounce';

import { ipc } from '../ipc';
import { commandStore } from '../commander';
import { commanderManager } from '../CommanderApp';
import { consoleManager } from '../Console';

export function useCommands({ cacheStore }) {
  useEffect(() => {
    const options = { fireImmediately: true };

    function selector(state) {
      return state;
    }

    const handler = debounce(function handler(state) {
      for (const [homeyId, commandsResult] of Object.entries(state)) {
        const commandSectionItems = [];

        for (const [index, entry] of commandsResult.arguments.entries()) {
          function run({ input }) {
            commanderManager.incrementLoadingCount();

            ipc
              .send({
                message: 'sendCommand',
                data: {
                  homeyId: homeyId,
                  command: entry.command,
                  input: input,
                },
              })
              .then(() => {})
              .catch((error) => {
                consoleManager.addError(error);
              })
              .finally(() => {
                commanderManager.decrementLoadingCount();
              });
          }

          commandSectionItems.push({
            key: `commands-${homeyId}-${index}`,
            type: 'command',
            textValue: entry.command,
            hint: entry.hint,
            action: run,
            context: {
              command: {
                ...entry,
                run,
              },
            }
          });
        }

        const sections = [
          {
            key: `commands-${homeyId}`,
            title: `Commands`,
            children: commandSectionItems,
          },
        ];

        const nextCommandSourcesByHomeyId = {
          ...cacheStore.getState().commands?.sourcesbyHomeyId,
          [homeyId]: {
            ...commandsResult,
          },
        };

        const nextCommandSectionsByHomeyId = {
          ...cacheStore.getState().commands?.sectionsByHomeyId,
          [homeyId]: sections,
        };

        cacheStore.setState({
          commands: {
            sourcesbyHomeyId: nextCommandSourcesByHomeyId,
            sectionsByHomeyId: nextCommandSectionsByHomeyId,
          },
        });
      }
    }, 100);

    const unsubscribe = commandStore.subscribe(selector, handler, options);

    return function () {
      unsubscribe();
    };
  }, [cacheStore]);
}

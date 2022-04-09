import { ipcRenderer } from 'electron';

import { useEffect } from 'react';

import { debounce } from '../../shared/debounce';
import { events } from '../../shared/events';

import { commandStore } from '../commander';
import { store } from '../CommanderApp';

export function useCommands({ cacheStore, setExecutionState }) {
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
            store.getState().incrementLoadingCount();
            setExecutionState({
              type: 'loading',
              data: null,
            });

            ipcRenderer
              .invoke(events.SEND_COMMAND, {
                data: {
                  homeyId: homeyId,
                  command: entry.command,
                  input: input,
                },
              })
              .then((result) => {
                console.log(result);

                setExecutionState({
                  type: 'success',
                  data: result,
                });
              })
              .catch((error) => {
                console.error(error);

                setExecutionState({
                  type: 'error',
                  data: error,
                });
              })
              .finally(() => {
                store.getState().decrementLoadingCount();
              });
          }

          commandSectionItems.push({
            key: `commands-${homeyId}-${index}`,
            type: 'command',
            textValue: entry.command,
            hint: entry.hint,
            inputAction: run,
            command: {
              ...entry,
              run,
            },
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
  }, [cacheStore, setExecutionState]);
}

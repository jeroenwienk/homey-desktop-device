import { ipcRenderer } from 'electron';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { useFilter } from 'react-aria';

import { COMMANDER, events } from '../shared/events';
import { apiStore, commandStore } from './commander';

import { DragIcon } from '../renderer/components/common/IconMask';
import { Item } from './Item';
import { Section } from './Section';
import { ComboBox } from './ComboBox';

export const cacheStore = create((set, get, api) => {
  return {
    cache: new Map(),
    buster: {},
  };
});

export const store = create((set, get, api) => {
  return {
    isSearchLocked: false,
    command: null,
    placeholder: '',
    path: [],
    sections: [],
  };
});

export function CommanderApp() {
  const comboBoxRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    ipcRenderer.send(COMMANDER.INIT, {});
  }, []);

  useEffect(() => {
    ipcRenderer.on('focusComboBox', (event, message) => {
      console.log(event, message);
      inputRef.current.focus();
    });
  }, []);

  function renderItem() {
    return <Item />;
  }

  function renderSection() {
    return <Section />;
  }

  const state = store();
  const cacheState = cacheStore();

  const apiState = apiStore();
  const commandState = commandStore();

  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);

  // convert to subscriber with timeout to batch
  const sections = useMemo(() => {
    switch (true) {
      case state.path.length === 0:
        let result = [];
        if (cacheState.cache.get('apis') != null) {
          result.push(cacheState.cache.get('apis'));
        }

        if (cacheState.cache.get('commands') != null) {
          const sections = cacheState.cache.get('commands').sections;

          if (sections != null) {
            for (const section of sections) {
              result.push(section);
            }
          }
        }

        return result;
      default:
        return state.sections;
    }
  }, [state.path, cacheState.buster]);

  useEffect(() => {
    const sections = [];

    for (const [homeyId, commandsList] of Object.entries(commandState)) {
      const commandSectionItems = [];

      for (const [index, entry] of commandsList.entries()) {
        commandSectionItems.push({
          key: index,
          type: 'command',
          textValue: entry.command,
          hint: entry.hint,
          command: {
            ...entry,
            run({ input }) {
              ipcRenderer
                .invoke(events.SEND_COMMAND, {
                  data: {
                    homeyId: homeyId,
                    command: entry.command,
                    input: input,
                  },
                })
                .catch(console.error);
            },
          },
        });
      }

      sections.push({
        key: `commands-${homeyId}`,
        title: `Commands ${homeyId}`,
        children: commandSectionItems,
      });
    }

    cacheStore.getState().cache.set('commands', {
      sections,
    });

    cacheStore.setState({
      buster: {},
    });
  }, [commandState]);

  useEffect(() => {
    const apis = Object.entries(apiState)
      .map(([cloudId, { name, api }]) => {
        return {
          key: cloudId,
          type: 'api',
          textValue: name,
          api,
        };
      })
      .sort((a, b) => {
        return a.textValue.localeCompare(b.textValue);
      });

    if (apis.length > 0) {
      cacheStore.getState().cache.set('apis', {
        key: 'apis',
        title: 'Homey',
        children: apis,
      });

      cacheStore.setState({
        buster: {},
      });
    }
  }, [apiState]);

  async function setNext({ key, value }) {
    let nextSections = [];
    let nextPlaceholder = '';
    let nextIsSearchLocked = false;
    let nextCommand = null;

    if (value.type === 'api') {
      const devices = await value.api.devices.getDevices();
      const zones = await value.api.zones.getZones();

      nextSections = [
        {
          key: 'devices',
          title: 'Devices',
          children: Object.entries(devices)
            .map(([id, device]) => {
              const zone = zones[device.zone];

              return {
                key: id,
                type: 'device',
                textValue:
                  zone != null
                    ? `${zone.name} - ${device.name}`
                    : `${device.name}`,
                device,
              };
            })
            .sort((a, b) => {
              return a.textValue.localeCompare(b.textValue);
            }),
        },
      ];
    } else if (value.type === 'device') {
      nextSections = [
        {
          key: 'device',
          title: 'Device',
          children: Object.entries(value.device.capabilitiesObj)
            .map(([capabilityId, capability]) => {
              return {
                key: capabilityId,
                type: 'capability',
                textValue: capability.title,
                filter: `${capability.id} ${capability.type}`,
                device: value.device,
                capability,
              };
            })
            .sort((a, b) => {
              return a.textValue.localeCompare(b.textValue);
            }),
        },
      ];
    } else if (value.type === 'capability') {
      if (
        value.capability.type === 'boolean' &&
        value.capability.setable &&
        value.capability.getable
      ) {
        nextSections = [
          {
            key: 'capability',
            title: 'Capability',
            children: [
              {
                key: 'toggle',
                type: 'action',
                textValue: 'Toggle',
                action() {
                  value.device.homey.devices
                    .getDevice({ id: value.device.id })
                    .then((device) => {
                      value.device
                        .setCapabilityValue({
                          capabilityId: value.capability.id,
                          value:
                            device.capabilitiesObj[value.capability.id]
                              .value !== true,
                        })
                        .catch(console.log);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                },
              },
              {
                key: 'true',
                type: 'action',
                textValue: 'On',
                action() {
                  value.device
                    .setCapabilityValue({
                      capabilityId: value.capability.id,
                      value: true,
                    })
                    .catch(console.log);
                },
              },
              {
                key: 'false',
                type: 'action',
                textValue: 'Off',
                action() {
                  value.device
                    .setCapabilityValue({
                      capabilityId: value.capability.id,
                      value: false,
                    })
                    .catch(console.log);
                },
              },
            ],
          },
        ];
      }
    } else if (value.type === 'command') {
      nextPlaceholder = 'Enter to run';
      nextIsSearchLocked = true;
      nextCommand = {
        key: 'run',
        type: 'run',
        textValue: 'Run',
        hint: value.command.hint,
        description: value.command.description,
        action() {
          value.command.run({
            input: inputRef.current.value,
          });
        },
      };

      nextSections = [
        {
          key: 'command',
          title: 'Command',
          children: [nextCommand],
        },
      ];
    } else {
      nextSections = [];
    }

    const currentState = store.getState();

    store.setState({
      isSearchLocked: nextIsSearchLocked,
      sections: nextSections,
      placeholder: nextPlaceholder,
      command: nextCommand,
      path: [
        ...currentState.path,
        {
          key,
          value,
          sections: nextSections,
          placeholder: nextPlaceholder,
          command: nextCommand,
          isSearchLocked: nextIsSearchLocked,
        },
      ],
    });
  }

  function onKeyDown(event, comboBoxState) {
    switch (event.key) {
      case 'Enter':
        // Only if the input is the only thing that is focused. Else the normal action handler
        // is used.
        if (
          state.command != null &&
          comboBoxState.selectionManager.focusedKey == null
        ) {
          state.command.action();
        }
        break;
      case 'Backspace':
        if (inputValue === '') {
          event.preventDefault();

          const nextPath = [...state.path];
          const currentPathItem = nextPath.pop();

          if (currentPathItem == null) return;

          store.setState({
            path: nextPath,
            sections: nextPath[nextPath.length - 1]?.sections ?? [],
            placeholder: nextPath[nextPath.length - 1]?.placeholder ?? '',
            isSearchLocked:
              nextPath[nextPath.length - 1]?.isSearchLocked ?? false,
          });

          setSelectedKey(null);
          setInputValue('');
        }
        break;
      default:
        break;
    }
  }

  function onInputChange(value) {
    console.log('onInputChange', value);
    setInputValue(value);
  }

  function onSelectionChange(key, comboBoxState) {
    console.log('onSelectionChange', key, comboBoxState);
    const item = comboBoxState.collection.getItem(key) ?? null;

    if (item == null) return;

    if (item.value.action) {
      item.value.action();
      return;
    } else {
      // It doesnt really make sense for now to even have a selection.
      // The current path can be considered the selection.
      setSelectedKey(null);
      setInputValue('');
    }

    setNext({
      key,
      value: item.value,
    }).catch(console.error);
  }

  const { contains } = useFilter({ sensitivity: 'base' });
  const instanceRef = useRef({
    defaultFilter(string, substring, node) {
      if (string === '__pending__') return true;

      const split = substring.split(' ');

      return split.every((chunk) => {
        return (
          instanceRef.current.contains(string, chunk) ||
          (node.filter != null &&
            instanceRef.current.contains(node.filter, chunk))
        );
      });
    },
  });
  instanceRef.current.contains = contains;

  const filteredSections = React.useMemo(() => {
    if (state.isSearchLocked === true) {
      return sections;
    }

    return filterNodes(sections, inputValue, instanceRef.current.defaultFilter);
  }, [sections, inputValue, state.isSearchLocked]);

  return (
    <CommanderApp.Root>
      <CommanderApp.Header>
        <CommanderApp.DragHandleWrapper>
          <CommanderApp.DragHandle />
        </CommanderApp.DragHandleWrapper>
      </CommanderApp.Header>

      <CommanderApp.ComboBoxWrapper>
        <ComboBox
          ref={comboBoxRef}
          inputRef={inputRef}
          label="Command"
          placeholder={state.placeholder}
          path={state.path}
          items={filteredSections}
          inputValue={inputValue}
          selectedKey={selectedKey}
          onKeyDown={onKeyDown}
          onInputChange={onInputChange}
          renderItem={renderItem}
          renderSection={renderSection}
          onSelectionChange={onSelectionChange}
        />
      </CommanderApp.ComboBoxWrapper>
    </CommanderApp.Root>
  );
}

function filterNodes(nodes, inputValue, filter) {
  const filteredNode = [];
  for (let node of nodes) {
    if (node.children != null) {
      const filtered = filterNodes(node.children, inputValue, filter);
      if ([...filtered].length > 0) {
        filteredNode.push({ ...node, children: filtered });
      }
    } else if (filter(node.textValue, inputValue, node)) {
      filteredNode.push({ ...node });
    }
  }
  return filteredNode;
}

CommanderApp.Header = styled.div`
  display: flex;
  justify-content: space-between;

  flex: 0 0 80px;
`;

CommanderApp.ComboBoxWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
`;

CommanderApp.Root = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 10px;
  // background: gray; // for debugging

  display: flex;
  flex-direction: column;

  ${ComboBox.Root} {
    width: 600px;
  }
`;

CommanderApp.DragHandleWrapper = styled.div``;
CommanderApp.DragHandle = styled(DragIcon)`
  -webkit-app-region: drag;
`;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import create from 'zustand';
import { useFilter } from 'react-aria';

import { COMMANDER } from '../shared/events';
import { apiStore, commandStore } from './commander';

import { DragIcon } from '../renderer/components/common/IconMask';
import { Item } from './Item';
import { Section } from './Section';
import { ComboBox } from './ComboBox';

export const store = create((set, get, api) => {
  return {
    cache: new Map(),
    path: [],
    buster: {},
  };
});

export function CommanderApp() {
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

  const apiState = apiStore();
  const commandState = commandStore();

  const [sections, setSections] = useState([]);
  const [path, setPath] = useState([]);
  const [placeholder, setPlaceholder] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState('');

  const pathSections = useMemo(() => {
    switch (true) {
      case state.path.length === 0:
        let result = [];
        if (state.cache.get('apis') != null) {
          result.push(state.cache.get('apis'));
        }

        if (state.cache.get('commands') != null) {
          const sections = state.cache.get('commands').sections;

          if (sections != null) {
            for (const section of sections) {
              result.push(section);
            }
          }
        }

        return result;
      default:
        return [];
    }
  }, [state.path, state.buster]);

  useEffect(() => {
    const sections = [];

    for (const [homeyId, commandsList] of Object.entries(commandState)) {
      const commandSectionItems = [];

      for (const [index, entry] of commandsList.entries()) {
        commandSectionItems.push({
          key: index,
          type: 'command',
          textValue: entry.command,
          command: {
            send() {
              console.log('send');
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

    store.getState().cache.set('commands', {
      sections,
    });

    store.setState({
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

    if (apis.length > 0 && path.length === 0) {
      store.getState().cache.set('apis', {
        key: 'apis',
        title: 'Homey',
        children: apis,
      });

      store.setState({
        buster: {},
      });
    }
  }, [apiState]);

  useEffect(() => {
    setSections((prevSections) => {
      return pathSections;
    });
  }, [pathSections]);

  async function setNext({ key, value }) {
    let nextSections = [];
    let nextPlaceholder = '';

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
      nextPlaceholder = 'Enter to send';

      // register enter callback

      nextSections = [
        {
          key: 'command',
          title: 'Command',
          children: [
            {
              key: 'send',
              type: 'send',
              textValue: 'Send',
              action() {
                value.command.send();
              },
            },
          ],
        },
      ];
    } else {
      nextSections = [];
    }

    setPath((prev) => {
      return [
        ...prev,
        {
          key,
          value,
          sections,
        },
      ];
    });

    setPlaceholder(nextPlaceholder);
    setSections(nextSections);
  }

  function onKeyDown(event) {
    switch (event.key) {
      case 'Enter':
        console.log(event.target.value);

        break;
      case 'Backspace':
        if (inputValue === '') {
          event.preventDefault();

          const nextPath = [...path];
          const prevPathItem = nextPath.pop();

          if (prevPathItem == null) return;

          setPath(nextPath);
          setSelectedKey(prevPathItem.key);
          // should probably just delete the whole word
          // setInputValue(prevPathItem.value.textValue);
          setSections(prevPathItem.sections);
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
      setSelectedKey(key);
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
    return filterNodes(sections, inputValue, instanceRef.current.defaultFilter);
  }, [sections, inputValue]);

  return (
    <CommanderApp.Root>
      <CommanderApp.Header>
        <CommanderApp.DragHandleWrapper>
          <CommanderApp.DragHandle />
        </CommanderApp.DragHandleWrapper>
      </CommanderApp.Header>

      <CommanderApp.ComboBoxWrapper>
        <ComboBox
          inputRef={inputRef}
          label="Command"
          placeholder={placeholder}
          path={path}
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

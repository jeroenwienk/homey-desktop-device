import { ipcRenderer } from 'electron';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useFilter } from 'react-aria';

import { ipc } from './ipc';

import { useSectionBuilder } from './sections/useSectionBuilder';
import { useHomeys } from './subscribers/homeys';
import { useCommands } from './subscribers/commands';
import { useCacheSubscriber } from './subscribers/useCacheSubscriber';
import { useFetchDevices } from './fetchers/useFetchDevices';

import { filterNodes } from './filterNodes';
import { makeCapabilitySections } from './sections/capabilities/capabilities';
import { makeDeviceSections } from './sections/device';

import { DragIcon } from '../renderer/components/common/IconMask';
import { Item } from '../renderer/components/common/Item';
import { Section } from '../renderer/components/common/Section';
import { ComboBox } from './ComboBox';
import { makeHelpSections } from './sections/help';

export const cacheStore = create(
  subscribeWithSelector((set, get, api) => {
    return {
      __pending: {},
      __timeout: null,
      help: {
        ...makeHelpSections({ value: null }),
      },
    };
  })
);

export const store = create(
  subscribeWithSelector((set, get, api) => {
    return {
      isSearchLocked: false,
      command: null,
      placeholder: 'Search...',
      path: [],
      sections: [],
      loadingCount: 0,
      incrementLoadingCount() {
        if (get().loadingCount > 0) {
          get().loadingCount = get().loadingCount + 1;
        } else {
          set({ loadingCount: get().loadingCount + 1 });
        }
      },
      decrementLoadingCount() {
        if (get().loadingCount > 1) {
          get().loadingCount = get().loadingCount - 1;
        } else {
          set({ loadingCount: get().loadingCount - 1 });
        }
      },
    };
  })
);

export function CommanderApp() {
  const comboBoxRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    ipc.send({ message: 'init' }).catch(console.log);

    ipcRenderer.on('focusComboBox', (event, message) => {
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
  const isLoading = state.loadingCount > 0;

  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [executionState, setExecutionState] = useState({ type: null });

  const [forcedUpdate, forceUpdate] = useState({});
  const cacheRef = useRef({});
  console.log(cacheRef.current);

  const sections = useSectionBuilder({ cacheRef, state, forcedUpdate });

  useHomeys({ cacheStore });
  useCommands({ cacheStore, setExecutionState });

  useCacheSubscriber({ key: 'homeys', cacheRef, forceUpdate });
  useCacheSubscriber({ key: 'commands', cacheRef, forceUpdate });
  useCacheSubscriber({ key: 'devices', cacheRef, forceUpdate });

  useFetchDevices({ inputValue });

  async function setNext({ key, value }) {
    let next = {
      type: null,
      sections: [],
      placeholder: '',
      isSearchLocked: false,
      command: null,
    };

    switch (value.type) {
      case 'homey':
        next = {
          ...next,
          type: 'homey',
        };
        break;
      case 'device':
        next = {
          ...next,
          type: 'device',
          ...makeDeviceSections({ value }),
        };
        break;
      case 'capability':
        next = {
          ...next,
          type: 'capability',
          ...makeCapabilitySections({ value }),
        };
        break;
      case 'command':
        const baseKey = `${value.key}-command`;

        let nextCommand = {
          key: `${baseKey}-run`,
          type: 'run',
          textValue: 'Run',
          hint: value.command.hint,
          description: value.command.description,
          action({ input }) {
            value.command.run({
              input: input,
            });
          },
        };

        next = {
          ...next,
          type: 'command',
          placeholder: 'Enter to run',
          isSearchLocked: true,
          command: nextCommand,
          sections: [
            {
              key: baseKey,
              title: 'Command',
              children: [nextCommand],
            },
          ],
        };
        break;
      default:
        break;
    }

    const currentState = store.getState();

    store.setState({
      ...next,
      path: [
        ...currentState.path,
        {
          key,
          value,
          ...next,
        },
      ],
    });
  }

  function onKeyDown(event, comboBoxState) {
    switch (event.key) {
      case '!':
        if (comboBoxState.selectionManager.focusedKey == null) {
          const firstKey = comboBoxState.collection.getFirstKey();
          const firstItem = comboBoxState.collection.getItem(firstKey);

          if (firstItem.type === 'section') {
            comboBoxState.selectionManager.setFocusedKey(firstItem.nextKey);
          } else {
            comboBoxState.selectionManager.setFocusedKey(firstItem.key);
          }
        }

        break;
      case 'Enter':
        // Only if the input is the only thing that is focused. Else the normal action handler
        // is used.
        if (
          state.command != null &&
          comboBoxState.selectionManager.focusedKey == null
        ) {
          state.command.action({ input: event.currentTarget.value });
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
      case 'Escape':
        event.preventDefault();
        ipc.send({ message: 'close' }).catch(console.log);
        break;
      default:
        break;
    }
  }

  function onInputChange(value) {
    // console.log('onInputChange', value);
    setInputValue(value);
  }

  function onSelectionChange(key, comboBoxState) {
    // console.log('onSelectionChange', key, comboBoxState);
    const item = comboBoxState.collection.getItem(key) ?? null;
    const markIndex = inputRef.current.value.indexOf('!');

    if (item == null || item.value?.selectable === false) return;

    let inputActionInput = null;

    if (markIndex !== -1) {
      inputActionInput = inputRef.current.value.substring(
        markIndex + 1,
        inputRef.current.value.length
      );
    }

    if (item.value.inputAction != null && inputActionInput != null) {
      item.value.inputAction({ input: inputActionInput });
      return;
    }

    if (item.value.action != null) {
      // this does not work with input because you are also filtering
      item.value.action({ input: inputRef.current.value });
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
    defaultFilter(textValue, inputValue, typeFilter, node) {
      const split = inputValue.split(' ');
      const isSameType = typeFilter != null ? node?.type === typeFilter : true;

      // console.log(inputValue);
      // console.log(typeFilter);

      return split.every((chunk) => {
        return (
          isSameType &&
          (instanceRef.current.contains(textValue, chunk) ||
            (node?.filter != null &&
              instanceRef.current.contains(node.filter, chunk)))
        );
      });
    },
  });
  instanceRef.current.contains = contains;

  const filteredSections = useMemo(() => {
    if (state.isSearchLocked === true) {
      return sections;
    }

    let filterPart = inputValue;
    let typeFilter = null;

    const atIndex = inputValue.indexOf('@');
    const questionIndex = inputValue.indexOf('?');

    if (questionIndex === 0) {
      const helpSections = cacheStore.getState().help.sections;
      const filter = filterPart.substring(1)

      console.log(helpSections);
      console.log(filter);

      return filterNodes(
        helpSections,
        filter,
        typeFilter,
        instanceRef.current.defaultFilter
      );
    }

    if (atIndex === 0) {
      const found = filterPart.match(/^(?<category>@\w*)/);

      if (found != null) {
        const category = found.groups.category;
        filterPart = filterPart.substring(category.length);
        typeFilter = category.substring(1);

        switch (true) {
          case typeFilter.startsWith('d'):
            typeFilter = 'device';
            break;
          case typeFilter.startsWith('h'):
            typeFilter = 'homey';
            break;
          case typeFilter.startsWith('c'):
            typeFilter = 'command';
            break;
          case typeFilter.startsWith('s'):
            typeFilter = 'system';
            break;
          default:
            break;
        }
      }
    }

    const markIndex = filterPart.indexOf('!');

    if (markIndex !== -1) {
      filterPart = filterPart.substring(0, markIndex);
    }

    return filterNodes(
      sections,
      filterPart,
      typeFilter,
      instanceRef.current.defaultFilter
    );
  }, [sections, inputValue, state.isSearchLocked]);

  return (
    <CommanderApp.Root>
      <CommanderApp.Header>
        <CommanderApp.DragHandleWrapper>
          <CommanderApp.DragHandle />
        </CommanderApp.DragHandleWrapper>
      </CommanderApp.Header>

      <CommanderApp.Content>
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
            executionState={executionState}
            isLoading={isLoading}
            renderItem={renderItem}
            renderSection={renderSection}
            onKeyDown={onKeyDown}
            onInputChange={onInputChange}
            onSelectionChange={onSelectionChange}
          />
        </CommanderApp.ComboBoxWrapper>
      </CommanderApp.Content>
    </CommanderApp.Root>
  );
}

CommanderApp.Header = styled.div`
  flex: 0 0 80px;
  display: flex;
  justify-content: space-between;
`;

CommanderApp.Content = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
`;

CommanderApp.ComboBoxWrapper = styled.div`
  width: 720px;
`;

CommanderApp.Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 10px;
`;

CommanderApp.DragHandleWrapper = styled.div``;
CommanderApp.DragHandle = styled(DragIcon)`
  -webkit-app-region: drag;
  cursor: grab;
`;

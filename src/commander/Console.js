import React from 'react';
import styled, { keyframes } from 'styled-components';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

import { vars } from '../shared/theme/GlobalStyles';

import { IconButton } from '../shared/components/IconButton';

import { iconClear } from '../assets/actions/clear';

export const consoleManager = new (class ConsoleManager {
  constructor() {
    this.store = create(
      persist(
        subscribeWithSelector((set, get, api) => {
          return {
            entries: null,
          };
        }),
        {
          name: 'console',
          getStorage: () => localStorage,
        }
      )
    );
  }

  addMessage({ message }) {
    this.store.setState((prevState) => {
      return {
        entries: [message, ...prevState.entries],
      };
    });
  }

  addError(error) {
    if (error instanceof Error) {
      this.store.setState((prevState) => {
        const nextEntries = [{ message: `${error}`, date: Date.now(), key: uuid() }, ...(prevState.entries ?? [])];

        if (nextEntries.length > 20) {
          nextEntries.pop();
        }

        return {
          entries: nextEntries,
        };
      });
    } else {
      console.log(error);
    }
  }

  clear() {
    this.store.setState((prevState) => {
      return {
        entries: null,
      };
    });
  }
})();

export function Console() {
  const state = consoleManager.store();

  function handleClearPress() {
    consoleManager.clear();
  }

  return (
    state.entries != null && (
      <Console.Root>
        <Console.Header>
          <IconButton
            size={vars.icon_size_default}
            url={iconClear}
            color={vars.color_icon_light}
            onPress={handleClearPress}
          />
        </Console.Header>

        <Console.List>
          {state.entries.map((entry) => {
            return (
              <Console.ListEntry key={entry.key}>
                <Console.Message>{entry.message}</Console.Message>
                <Console.Time>{new Date(entry.date).toLocaleTimeString()}</Console.Time>
              </Console.ListEntry>
            );
          })}
        </Console.List>
      </Console.Root>
    )
  );
}

Console.Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  align-items: stretch;
  width: 100%;
  max-width: 480px;
  height: 720px;
  background-color: #f6f7fb;
  border-radius: 4px;
  border: 2px solid #dddee2;
`;

Console.Header = styled.header`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: -48px;
  right: 0;
`;

Console.List = styled.ul`
  overflow-y: auto;
`;

Console.ListEntry = styled.li`
  padding: 8px;
  opacity: 1;
  animation: 500ms ease-in-out;
  animation-fill-mode: forwards;
  animation-name: ${keyframes`
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  `};

  &:not(:last-of-type) {
    border-bottom: 1px solid #dddee2;
  }
`;

Console.Message = styled.div``;
Console.Time = styled.div`
  padding-top: 4px;
  font-weight: 500;
`;

import React from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const consoleStore = create(
  subscribeWithSelector((set, get, api) => {
    return {
      message: null,
    };
  })
);

export function Console() {
  const state = consoleStore();

  return state.message != null && <Console.Root>{state.message}</Console.Root>;
}

Console.Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 720px;
  background-color: #f6f7fb;
  border-radius: 4px;
  padding: 8px;
  border: 2px solid #dddee2;
`;

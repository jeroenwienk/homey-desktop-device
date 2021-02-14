import React from 'react';
import ReactDOM from 'react-dom';
import create from 'zustand';
import { ipcRenderer } from 'electron';
import { createGlobalStyle } from 'styled-components';

import { MAIN } from '../shared/events';

import { GlobalStyles } from '../renderer/theme/GlobalStyles';

import { App } from './App';

export const displayStore = create((set) => ({
  texts: {},
  displays: [],
}));

ipcRenderer.on(MAIN.DISPLAY_SET, (event, data) => {
  displayStore.setState({
    texts: {
      ...displayStore.getState().texts,
      [data.display.id]: data.text,
    },
  });
});

ipcRenderer.on(MAIN.DISPLAYS_INIT, (event, data) => {
  displayStore.setState({
    displays: data,
  });
});

const OverlayStyles = createGlobalStyle`
  body {
    color: white;
    background-color: transparent;
  }
`;

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <OverlayStyles />
    <App />
  </React.StrictMode>,
  rootElement
);

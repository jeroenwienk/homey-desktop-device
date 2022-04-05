import React from 'react';
import ReactDOM from 'react-dom';
import create from 'zustand';
import { createGlobalStyle } from 'styled-components';
import { default as HomeyAPIApp } from 'homey-api/lib/HomeyAPI/HomeyAPIApp';

import { ipcRenderer } from 'electron';
import { MAIN, events } from '../shared/events';

import { GlobalStyles } from '../renderer/theme/GlobalStyles';

import { CommanderApp } from './CommanderApp';

export const apiStore = create((set, get, api) => ({}));

export const commandStore = create((set, get, api) => {
  return {};
});

ipcRenderer.on(events.ON_COMMAND_ARGUMENT_VALUES, (event, data) => {
  if (data?.homeyId != null && data.arguments != null) {
    commandStore.setState({
      [data.homeyId]: data.arguments
    })
  }
});

ipcRenderer.on(MAIN.ON_API_PROPS, (event, data) => {
  console.log(MAIN.ON_API_PROPS, event, data);

  if (data == null) {
    console.log(`${MAIN.ON_API_PROPS} returned ${data}`);
    return;
  }

  const state = apiStore.getState();

  if (state[data.cloudId]) {
    // todo
    // check if still valid token
    return;
  }

  const homeyAPI = new HomeyAPIApp({
    homey: {
      api: {
        getOwnerApiToken() {
          return data.token;
        },
        getLocalUrl() {
          return data.url.replace(
            'localhost',
            data.address.substring('::ffff:'.length)
          );
        },
      },
    },
  });

  homeyAPI
    .login()
    .then(() => {
      apiStore.setState({
        [data.cloudId]: {
          ...data,
          api: homeyAPI,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const CommanderStyles = createGlobalStyle`
  body {
    color: #181818;
    background-color: transparent;
  }
`;

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <CommanderStyles />
    <CommanderApp />
  </React.StrictMode>,
  rootElement
);

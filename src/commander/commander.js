import { ipcRenderer } from 'electron';

import React from 'react';
import ReactDOM from 'react-dom';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createGlobalStyle } from 'styled-components';
import { default as HomeyAPIApp } from 'homey-api/lib/HomeyAPI/HomeyAPIApp';

import { ipc } from './ipc';
import { events } from '../shared/events';

import { GlobalStyles } from '../renderer/theme/GlobalStyles';

import { CommanderApp } from './CommanderApp';

export const apiStore = create(
  subscribeWithSelector((set, get, api) => {
    return {};
  })
);

export const commandStore = create(
  subscribeWithSelector((set, get, api) => {
    return {};
  })
);

ipcRenderer.on(events.ON_COMMAND_ARGUMENT_VALUES, (event, data) => {
  if (data?.homeyId != null && data.arguments != null) {
    commandStore.setState({
      [data.homeyId]: {
        ...data,
      },
    });
  }
});

ipcRenderer.on(events.ON_API_PROPS, (event, data) => {
  if (data == null) {
    console.log(`${events.ON_API_PROPS} returned ${data}`);
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
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    color: #181818;
    background-color: transparent;
  }
`;

const rootElement = document.getElementById('root');

window.addEventListener('keydown', (event) => {
  if (event.target === document.body && event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();

    ipc.send({ message: 'close' }).catch(console.error);
  }
});

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <CommanderStyles />
    <CommanderApp />
  </React.StrictMode>,
  rootElement
);

import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { createGlobalStyle } from 'styled-components';

import { MAIN } from '../shared/events';

import { GlobalStyles } from './theme/GlobalStyles';
import create from 'zustand';

const rootElement = document.getElementById('root');

ipcRenderer.on(MAIN.DISPLAY_SET, (event, data) => {
  displayStore.setState({
    value: data,
  });
});

export const displayStore = create((set) => ({
  value: null,
}));

const Test = createGlobalStyle`
  body {
    color: white;
    background-color: green;
    padding: 10px;
  }

  .test {
    -webkit-app-region: drag;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Test />
    <div className="test">dragme</div>
    <MyComp />
  </React.StrictMode>,
  rootElement
);

function MyComp() {
  const value = displayStore((state) => state.value);

  console.log(value);

  return <div>{value?.text}</div>;
}

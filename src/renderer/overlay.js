import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { createGlobalStyle } from 'styled-components';

import { MAIN, OVERLAY } from '../shared/events';

import { GlobalStyles } from './theme/GlobalStyles';
import create from 'zustand';

const rootElement = document.getElementById('root');

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

const Styles = createGlobalStyle`
  body {
    color: white;
    background-color: rgba(41,41,41,1);
    padding: 10px;
    border: 1px solid white;
  }

  .test {
    -webkit-app-region: drag;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Styles />
    <div className="test">dragme</div>
    <App />
  </React.StrictMode>,
  rootElement
);

function App() {
  const texts = displayStore((state) => state.texts);
  const displays = displayStore((state) => state.displays);

  useEffect(() => {
    ipcRenderer.send(OVERLAY.INIT, {});
  }, []);

  return (
    <div>
      {displays.map((display) => {
        return (
          <div key={display.id}>
            <div>{display.name}</div>
            <div>{texts[display.id]}</div>
          </div>
        );
      })}
    </div>
  );
}

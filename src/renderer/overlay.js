import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import create from 'zustand';
import { ipcRenderer } from 'electron';
import { createGlobalStyle } from 'styled-components';

import { MAIN, OVERLAY } from '../shared/events';

import { vars } from './theme/GlobalStyles';
import { GlobalStyles } from './theme/GlobalStyles';
import { DragIcon } from './components/common/IconMask';

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
    background-color: rgba(41,41,41,1);
    padding: 10px;
    border: 1px solid white;
  }
`;

function Overlay() {
  const texts = displayStore((state) => state.texts);
  const displays = displayStore((state) => state.displays);

  useEffect(() => {
    ipcRenderer.send(OVERLAY.INIT, {});
  }, []);

  return (
    <sc.container>
      <sc.dragHandleWrapper>
        <sc.dragHandle />
      </sc.dragHandleWrapper>

      {displays.map((display) => {
        return (
          <sc.displayContainer key={display.id}>
            <sc.name>{display.name}</sc.name>
            <sc.text>
              {texts[display.id] != null ? texts[display.id] : display.text}
            </sc.text>
          </sc.displayContainer>
        );
      })}
    </sc.container>
  );
}

const sc = {
  container: styled.div``,
  displayContainer: styled.div``,
  name: styled.div`
    display: inline-block;
    color: ${vars.color_primary_text_accent};
    font-size: 24px;
    margin-right: 8px;
  `,
  text: styled.div`
    display: inline-block;
    font-size: 24px;
  `,
  dragHandleWrapper: styled.div`
    display: flex;
    justify-content: flex-end;
  `,
  dragHandle: styled(DragIcon)`
    -webkit-app-region: drag;
    
    &:hover {
      background-color: ${vars.color_green};
    }
  `,
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <OverlayStyles />
    <Overlay />
  </React.StrictMode>,
  rootElement
);

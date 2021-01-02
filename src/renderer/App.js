import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { history } from './memoryHistory';
import { REND } from '../shared/events';
import { vars } from './theme/GlobalStyles';

import { Connections } from './containers/Connections';
import { History } from './containers/History';
import { Buttons } from './containers/buttons/Buttons';
import { Accelerators } from './containers/accelerators/Accelerators';
import { Broken } from './containers/Broken';
import { MenuButton } from './components/common/Menu';

export function App() {
  useEffect(() => {
    ipcRenderer.send(REND.INIT, {});
  }, []);

  return (
    <sc.grid>
      <sc.header>
        <MenuButton
          label="Create"
          onAction={(key) => {
            history.push(`/${key}?id=create`);
          }}
        >
          <MenuButton.Item key="button">Button</MenuButton.Item>
          <MenuButton.Item key="accelerator">Shortcut</MenuButton.Item>
        </MenuButton>
        <Connections />
      </sc.header>
      <sc.main>
        <Buttons />
        <Accelerators />
        <Broken />
      </sc.main>
      <sc.sidebar>
        <History />
      </sc.sidebar>
    </sc.grid>
  );
}

const sc = {
  grid: styled.div`
    display: grid;
    grid-template-columns: auto auto auto 400px;
    grid-template-rows: 64px repeat(3, 1fr);
    grid-template-areas:
      'header header header header'
      'main main main sidebar'
      'main main main sidebar'
      'main main main sidebar';
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  `,
  header: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-area: header;
    min-height: 0;
    padding: 0 8px;
    z-index: ${vars.z_index_header};
    background-color: ${vars.color_background_panel};
    box-shadow: ${vars.box_shadow_header};
  `,
  main: styled.main`
    grid-area: main;
    display: flex;
    flex-direction: column;
    min-height: 0;
    gap: 16px;
    padding: 16px;
    overflow-y: auto;
  `,
  sidebar: styled.aside`
    grid-area: sidebar;
    min-height: 0;
    padding: 16px;
    overflow-y: auto;
  `,
};

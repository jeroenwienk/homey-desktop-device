import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { history } from './memoryHistory';
import { REND } from '../shared/events';
import { VAR, VARIABLES } from './theme/GlobalStyles';

import { Connections } from './containers/Connections';
import { History } from './containers/History';
import { Buttons } from './containers/buttons/Buttons';
import { Accelerators } from './containers/accelerators/Accelerators';
import { Broken } from './containers/Broken';
import { MenuButton, MenuButtonItem } from './components/common/Menu';

export function App() {
  useEffect(() => {
    ipcRenderer.send(REND.INIT, {});
  }, []);

  return (
    <Grid>
      <Header>
        <MenuButton
          key={1}
          label="Create"
          onAction={(key) => {
            history.push(`/${key}?id=create`);
          }}
        >
          <MenuButtonItem key="button">Button</MenuButtonItem>
          <MenuButtonItem key="accelerator">Shortcut</MenuButtonItem>
        </MenuButton>
        <Connections />
      </Header>
      <Main>
        <Buttons />
        <Accelerators />
        <Broken />
      </Main>
      <Sidebar>
        <History />
      </Sidebar>
    </Grid>
  );
}

const Grid = styled.div`
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
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: header;
  min-height: 0;
  padding: 0 8px;
  z-index: ${VAR(VARIABLES.Z_INDEX_HEADER)};
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_PANEL)};
  box-shadow: ${VAR(VARIABLES.BOX_SHADOW_HEADER)};
`;

const Main = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

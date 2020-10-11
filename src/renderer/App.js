import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { REND } from '../shared/events';

import { Connections } from './containers/Connections';
import { History } from './containers/History';
import { Buttons } from './containers/Buttons';

export function App() {
  useEffect(() => {
    ipcRenderer.send(REND.INIT, {});
  }, []);

  return (
    <Grid>
      <Header>
        <Connections />
      </Header>
      <Main>
        <Buttons />
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
  grid-area: header;
  min-height: 0;
  padding: 16px;
`;

const Main = styled.main`
  grid-area: main;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

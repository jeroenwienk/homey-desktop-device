import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { History } from './containers/History';
import { Buttons } from './containers/Buttons';

import { REND } from '../shared/events';

export function App() {
  useEffect(() => {
    ipcRenderer.send(REND.INIT, {});
  }, []);

  return (
    <Grid>
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
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'main main main sidebar'
    'main main main sidebar'
    'main main main sidebar';
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

const Main = styled.main`
  grid-area: main;
  padding: 16px;
  overflow-y: auto;
`;

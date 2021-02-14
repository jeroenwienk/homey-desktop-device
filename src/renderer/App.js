import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, shell } from 'electron';
import semver from 'semver';
import { useLink } from '@react-aria/link';

import { REND } from '../shared/events';

import { history } from './memoryHistory';
import { vars } from './theme/GlobalStyles';

import { Connections } from './containers/Connections';
import { History } from './containers/History';

import { Buttons } from './containers/buttons/Buttons';
import { Accelerators } from './containers/accelerators/Accelerators';
import { Displays } from './containers/displays/Displays';
import { Inputs } from './containers/inputs/Inputs';
import { Broken } from './containers/Broken';

import { MenuButton } from './components/common/Menu';
import { ExternalLink } from './components/common/ExternalLink';

export function App() {
  const [isLatestVersion, setIsLatestVersion] = useState(true);

  useEffect(() => {
    ipcRenderer.send(REND.INIT, {});

    ipcRenderer.invoke('version', {}).then(({ version }) => {
      fetch(
        'https://api.github.com/repos/jeroenwienk/homey-desktop-device/releases/latest'
      )
        .then((res) => res.json())
        .then((json) => {
          const latestVersion = semver.clean(json.tag_name);

          if (semver.lt(version, latestVersion)) {
            setIsLatestVersion(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, []);

  return (
    <sc.Grid>
      <sc.Header>
        <MenuButton
          label="Create"
          onAction={(key) => {
            history.push(`/${key}?id=create`);
          }}
        >
          <MenuButton.Item key="button">Button</MenuButton.Item>
          <MenuButton.Item key="accelerator">Shortcut</MenuButton.Item>
          <MenuButton.Item key="display">Display</MenuButton.Item>
          <MenuButton.Item key="input">Input</MenuButton.Item>
        </MenuButton>

        {isLatestVersion === false && (
          <ExternalLink
            onPress={() => {
              shell.openExternal(
                'https://github.com/jeroenwienk/homey-desktop-device/releases/latest'
              );
            }}
          >
            New Version
          </ExternalLink>
        )}
        <Connections />
      </sc.Header>
      <sc.Main>
        <Inputs />
        <Buttons />
        <Accelerators />
        <Displays />
        <Broken />
      </sc.Main>
      <sc.Sidebar>
        <History />
      </sc.Sidebar>
    </sc.Grid>
  );
}

const sc = {};

sc.Grid = styled.div`
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

sc.Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: header;
  min-height: 0;
  padding: 0 8px;
  z-index: ${vars.z_index_header};
  background-color: ${vars.color_background_header};
  box-shadow: ${vars.box_shadow_header};
`;

sc.Main = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
`;

sc.Sidebar = styled.aside`
  grid-area: sidebar;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

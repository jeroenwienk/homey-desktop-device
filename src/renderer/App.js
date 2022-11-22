import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, shell } from 'electron';
import semver from 'semver';
import { Route } from 'react-router';

import { REND } from '../shared/events';

import { history } from './memoryHistory';
import { vars } from '../shared/theme/GlobalStyles';

import { SettingsDialog } from './SettingsDialog';

import { Connections } from './containers/Connections';
import { History } from './containers/History';

import { Buttons } from './containers/buttons/Buttons';
import { Accelerators } from './containers/accelerators/Accelerators';
import { Displays } from './containers/displays/Displays';
import { Inputs } from './containers/inputs/Inputs';

import { MenuButton } from '../shared/components/Menu';
import { ExternalLink } from '../shared/components/ExternalLink';
import { IconButton } from '../shared/components/IconButton';

import { SettingsIcon } from '../shared/components/IconMask';

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
    <App.Grid>
      <Route
        exact
        path="/settings"
        render={(routeProps) => {
          return <SettingsDialog {...routeProps} />;
        }}
      />

      <App.Header>
        <div style={{ display: 'flex', gap: 4 }}>
          <MenuButton
            label="Create"
            onAction={(key) => {
              history.push(`/${key}?id=create`);
            }}
          >
            <MenuButton.Item key="input">Input</MenuButton.Item>
            <MenuButton.Item key="button">Button</MenuButton.Item>
            <MenuButton.Item key="accelerator">Shortcut</MenuButton.Item>
            <MenuButton.Item key="display">Display</MenuButton.Item>
          </MenuButton>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IconButton
              iconComponent={SettingsIcon}
              aria-label="settings"
              onPress={() => {
                history.push(`/settings`);
              }}
            />
          </div>
        </div>

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
      </App.Header>
      <App.Main>
        <Inputs />
        <Buttons />
        <Accelerators />
        <Displays />
      </App.Main>
      <App.Sidebar>
        <History />
      </App.Sidebar>
    </App.Grid>
  );
}

App.Grid = styled.div`
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

App.Header = styled.header`
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

App.Main = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
`;

App.Sidebar = styled.aside`
  grid-area: sidebar;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

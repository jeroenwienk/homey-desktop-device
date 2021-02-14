import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';

import { useAcceleratorList } from '../../store/acceleratorStore';

import { AcceleratorDialog } from './AcceleratorDialog';
import { AcceleratorEntry } from './AcceleratorEntry';
import { Heading } from '../../components/common/Heading';

export function Accelerators() {
  const acceleratorList = useAcceleratorList();

  return (
    <sc.Container>
      <Route
        exact
        path="/accelerator"
        render={(routeProps) => {
          return (
            <AcceleratorDialog
              {...routeProps}
              acceleratorList={acceleratorList}
            />
          );
        }}
      />

      <sc.Section>
        <Heading>Shortcuts</Heading>
        <sc.Grid>
          {acceleratorList.map((acceleratorEntry) => {
            function handlePress() {
              ipcRenderer.send(REND.ACCELERATOR_RUN, {
                id: acceleratorEntry.id,
              });
            }

            function handleContextMenu() {
              history.push(`/accelerator?id=${acceleratorEntry.id}`);
            }

            return (
              <AcceleratorEntry
                key={acceleratorEntry.id}
                id={acceleratorEntry.id}
                accelerator={acceleratorEntry}
                onPress={handlePress}
                onContextMenu={handleContextMenu}
              />
            );
          })}
        </sc.Grid>
      </sc.Section>
    </sc.Container>
  );
}

const sc = {};

sc.Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

sc.Section = styled.section`
  flex: 1 1 auto;
`;

sc.Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  margin: 16px 0 0;

  @media only screen and (min-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media only screen and (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media only screen and (min-width: 1560px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media only screen and (min-width: 1840px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

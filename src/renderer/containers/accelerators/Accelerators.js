import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';
import { acceleratorStore } from '../../store/acceleratorStore';

import { AcceleratorDialog } from './AcceleratorDialog';
import { AcceleratorEntry } from './AcceleratorEntry';
import { Heading } from '../../components/common/Heading';

export function Accelerators() {
  const accelerators = acceleratorStore((state) => state.accelerators);

  return (
    <Container>
      <Route
        exact
        path="/accelerator"
        render={(routeProps) => {
          return (
            <AcceleratorDialog {...routeProps} accelerators={accelerators} />
          );
        }}
      />

      <AcceleratorSection>
        <Heading>Shortcuts</Heading>
        <AcceleratorList>
          {accelerators.map((accelerator) => {
            return (
              <AcceleratorEntry
                key={accelerator.id}
                id={accelerator.id}
                accelerator={accelerator}
                onPress={(event) => {
                  ipcRenderer.send(REND.ACCELERATOR_RUN, {
                    id: event.target.id,
                  });
                }}
                onContextMenu={(event) => {
                  history.push(`/accelerator?id=${event.currentTarget.id}`);
                }}
              />
            );
          })}
        </AcceleratorList>
      </AcceleratorSection>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

const AcceleratorSection = styled.div`
  flex: 1 1 auto;
`;

const AcceleratorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 16px 0 0;
`;

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
    <sc.container>
      <Route
        exact
        path="/accelerator"
        render={(routeProps) => {
          return (
            <AcceleratorDialog {...routeProps} accelerators={accelerators} />
          );
        }}
      />

      <sc.section>
        <Heading>Shortcuts</Heading>
        <sc.grid>
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
        </sc.grid>
      </sc.section>
    </sc.container>
  );
}

const sc = {
  container: styled.div`
    display: flex;
    align-items: flex-start;
    gap: 32px;
  `,
  section: styled.div`
    flex: 1 1 auto;
  `,
  grid: styled.div`
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
  `,
};

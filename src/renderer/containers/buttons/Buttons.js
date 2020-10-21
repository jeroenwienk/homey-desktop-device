import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';

import { buttonStore } from '../../store/buttonStore';

import { ButtonDialog } from './ButtonDialog';
import { ButtonEntry } from './ButtonEntry';
import { Heading } from '../../components/common/Heading';

export function Buttons() {
  const buttons = buttonStore((state) => state.buttons);

  return (
    <Container>
      <Route
        exact
        path="/button"
        render={(routeProps) => {
          return <ButtonDialog {...routeProps} buttons={buttons} />;
        }}
      />

      <ButtonSection>
        <Heading>Buttons</Heading>
        <ButtonList>
          {buttons.map((button) => {
            return (
              <ButtonEntry
                key={button.id}
                id={button.id}
                button={button}
                onPress={(event) => {
                  ipcRenderer.send(REND.BUTTON_RUN, { id: event.target.id });
                }}
                onContextMenu={(event) => {
                  history.push(`/button?id=${event.currentTarget.id}`);
                }}
              />
            );
          })}
        </ButtonList>
      </ButtonSection>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

const ButtonSection = styled.div`
  flex: 1 1 auto;
`;

const ButtonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 16px 0 0;
`;

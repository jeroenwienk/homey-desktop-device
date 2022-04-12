import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';

import { useButtonList } from '../../store/buttonStore';

import { ButtonDialog } from './ButtonDialog';
import { ButtonEntry } from './ButtonEntry';
import { Heading } from '../../../shared/components/Heading';

export function Buttons() {
  const buttonList = useButtonList();

  return (
    <sc.Container>
      <Route
        exact
        path="/button"
        render={(routeProps) => {
          return <ButtonDialog {...routeProps} buttonList={buttonList} />;
        }}
      />

      <sc.Section>
        <Heading>Buttons</Heading>
        <sc.Grid>
          {buttonList.map((buttonEntry) => {
            function handlePress() {
              ipcRenderer.send(REND.BUTTON_RUN, { id: buttonEntry.id });
            }

            function handleContextMenu() {
              history.push(`/button?id=${buttonEntry.id}`);
            }

            return (
              <ButtonEntry
                key={buttonEntry.id}
                id={buttonEntry.id}
                button={buttonEntry}
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

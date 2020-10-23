import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';

import { useButtonList } from '../../store/buttonStore';

import { ButtonDialog } from './ButtonDialog';
import { ButtonEntry } from './ButtonEntry';
import { Heading } from '../../components/common/Heading';

export function Buttons() {
  const buttonList = useButtonList();

  return (
    <buttons.root>
      <Route
        exact
        path="/button"
        render={(routeProps) => {
          return <ButtonDialog {...routeProps} buttonList={buttonList} />;
        }}
      />

      <buttons.section>
        <Heading>Buttons</Heading>
        <buttons.list>
          {buttonList.map((buttonEntry) => {
            return (
              <ButtonEntry
                key={buttonEntry.id}
                id={buttonEntry.id}
                button={buttonEntry}
                onPress={() => {
                  ipcRenderer.send(REND.BUTTON_RUN, { id: buttonEntry.id });
                }}
                onContextMenu={() => {
                  history.push(`/button?id=${buttonEntry.id}`);
                }}
              />
            );
          })}
        </buttons.list>
      </buttons.section>
    </buttons.root>
  );
}

const buttons = {
  root: styled.div`
    display: flex;
    align-items: flex-start;
    gap: 32px;
  `,
  section: styled.div`
    flex: 1 1 auto;
  `,
  list: styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin: 16px 0 0;
  `,
};

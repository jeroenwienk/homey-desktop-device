import React from 'react';
import styled from 'styled-components';
//import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
//import { REND } from '../../../shared/events';

import { useDisplayList } from '../../store/displayStore';

import { DisplayDialog } from './DisplayDialog';
import { DisplayEntry } from './DisplayEntry';
import { Heading } from '../../components/common/Heading';

export function Displays() {
  const displayList = useDisplayList();

  return (
    <sc.container>
      <Route
        exact
        path="/display"
        render={(routeProps) => {
          return <DisplayDialog {...routeProps} displayList={displayList} />;
        }}
      />

      <sc.section>
        <Heading>Displays</Heading>
        <sc.grid>
          {displayList.map((displayEntry) => {
            return (
              <DisplayEntry
                key={displayEntry.id}
                id={displayEntry.id}
                display={displayEntry}
                onPress={() => {
                  //ipcRenderer.send(REND.BUTTON_RUN, { id: displayEntry.id });
                }}
                onContextMenu={() => {
                  history.push(`/display?id=${displayEntry.id}`);
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

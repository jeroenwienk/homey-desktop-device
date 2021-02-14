import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';

import { useDisplayList } from '../../store/displayStore';

import { DisplayDialog } from './DisplayDialog';
import { DisplayEntry } from './DisplayEntry';
import { Heading } from '../../components/common/Heading';

export function Displays() {
  const displayList = useDisplayList();

  return (
    <sc.Container>
      <Route
        exact
        path="/display"
        render={(routeProps) => {
          return <DisplayDialog {...routeProps} displayList={displayList} />;
        }}
      />

      <sc.Section>
        <Heading>Displays</Heading>
        <sc.Grid>
          {displayList.map((displayEntry) => {
            function handlePress() {}

            function handleContextMenu() {
              history.push(`/display?id=${displayEntry.id}`);
            }

            return (
              <DisplayEntry
                key={displayEntry.id}
                id={displayEntry.id}
                display={displayEntry}
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

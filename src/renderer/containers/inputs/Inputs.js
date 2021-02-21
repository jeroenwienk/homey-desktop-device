import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { Route } from 'react-router';

import { history } from '../../memoryHistory';
import { REND } from '../../../shared/events';

import { useInputList } from '../../store/inputStore';

import { InputDialog } from './InputDialog';
import { InputEntry } from './InputEntry';
import { Heading } from '../../components/common/Heading';

export function Inputs() {
  const inputList = useInputList();

  return (
    <sc.Container>
      <Route
        exact
        path="/input"
        render={(routeProps) => {
          return <InputDialog {...routeProps} inputList={inputList} />;
        }}
      />

      <sc.Section>
        <Heading>Inputs</Heading>
        <sc.Grid>
          {inputList.map((inputEntry) => {
            function handleSubmit(event) {
              let content = null;

              switch (inputEntry.type) {
                case 'number':
                  content = parseFloat(event.target.value);
                  break;
                case 'text':
                  content = event.target.value;
                  break;
                default:
                  console.error(`Invalid input type: ${inputEntry.type}`);
              }

              ipcRenderer.send(REND.INPUT_RUN, {
                id: event.target.id,
                type: inputEntry.type,
                content: content,
              });
            }

            function handleContextMenu() {
              history.push(`/input?id=${inputEntry.id}`);
            }

            return (
              <InputEntry
                key={inputEntry.id}
                id={inputEntry.id}
                input={inputEntry}
                onSubmit={handleSubmit}
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
    grid-template-columns: repeat(1, 1fr);
  }

  @media only screen and (min-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 1560px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media only screen and (min-width: 1840px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

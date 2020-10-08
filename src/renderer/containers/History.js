import React from 'react';
import styled from 'styled-components';

import { VARIABLES, VAR } from '../theme/GlobalStyles';
import { historyStore } from '../store/historyStore';

import { Heading } from '../components/Heading';

export function History() {
  const history = historyStore((state) => state.history);

  return (
    <>
      <Heading>History</Heading>
      <HistoryList>
        {history.map((entry, index) => {
          return (
            <HistoryListItem key={index}>
              <strong>{entry.name}</strong> : {entry.argument}
            </HistoryListItem>
          );
        })}
      </HistoryList>
    </>
  );
}

const HistoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_DARK)};
  list-style: none;
`;

const HistoryListItem = styled.li`
  padding: 16px 32px;
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_LIGHT)};
  box-shadow: ${VAR(VARIABLES.BOX_SHADOW_DEFAULT)};
  word-break: break-all;
  overflow: hidden;
`;

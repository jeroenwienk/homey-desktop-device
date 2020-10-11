import React from 'react';
import styled from 'styled-components';

import { VARIABLES, VAR } from '../theme/GlobalStyles';
import { historyStore } from '../store/historyStore';

import { Heading } from '../components/Heading';

const dateOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
};

const dateFormatter = new Intl.DateTimeFormat('default', dateOptions);

export function History() {
  const history = historyStore((state) => state.history);

  return (
    <>
      <Heading>History</Heading>
      <HistoryList>
        {history.map((entry, index) => {
          return (
            <HistoryEntry key={index}>
              <HistoryTitle>{entry.name}</HistoryTitle>
              <HistoryArgument>{entry.argument}</HistoryArgument>
              <HistoryTime>{dateFormatter.format(entry.date)}</HistoryTime>
            </HistoryEntry>
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

const HistoryEntry = styled.li`
  padding: 16px 32px;
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_LIGHT)};
  box-shadow: ${VAR(VARIABLES.BOX_SHADOW_DEFAULT)};
  word-break: break-all;
  overflow: hidden;
`;

const HistoryTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 22px;
  line-height: 32px;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_DARK)};
`;

const HistoryArgument = styled.div`
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_DARK)};
`;

const HistoryTime = styled.div`
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_DARK_ACCENT)};
  font-weight: 500;
`;

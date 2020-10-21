import React from 'react';
import styled from 'styled-components';

import { VARIABLES, VAR } from '../theme/GlobalStyles';
import { historyStore } from '../store/historyStore';

import { BrowserIcon, PathIcon } from '../components/common/IconMask';

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
    <HistoryList>
      {history.map((entry, index) => {
        const IconComponent = getIconComponent(entry.name);

        return (
          <HistoryEntry key={index}>
            <div>
              <IconComponent
                size={24}
                color={VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)}
              />
            </div>
            <div>
              <div className="argument">{entry.argument}</div>
              <div className="time">{dateFormatter.format(entry.date)}</div>
            </div>
          </HistoryEntry>
        );
      })}
    </HistoryList>
  );
}

function getIconComponent(name) {
  switch (name) {
    case 'browser:open':
      return BrowserIcon;
    case 'path:open':
      return PathIcon;
    default:
      return React.Fragment;
  }
}

const HistoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const HistoryEntry = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_PANEL)};
  box-shadow: ${VAR(VARIABLES.BOX_SHADOW_DEFAULT)};
  word-break: break-all;
  overflow: hidden;
  border-radius: 3px;

  .argument {
    color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};
  }

  .time {
    color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)};
    font-weight: 500;
    margin-top: 8px;
  }
`;

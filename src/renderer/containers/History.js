import React from 'react';
import styled from 'styled-components';

import { vars } from '../theme/GlobalStyles';
import { useHistoryList } from '../store/historyStore';

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
  const historyList = useHistoryList();

  return (
    <sc.List>
      {historyList.length === 0 ? (
        <sc.Entry>
          <div />
          <div>
            <sc.Argument>History empty</sc.Argument>
          </div>
        </sc.Entry>
      ) : (
        historyList.map((historyEntry, index) => {
          const IconComponent = getIconComponent(historyEntry.name);

          return (
            <sc.Entry key={index}>
              <div>
                <IconComponent
                  size={vars.icon_size_small}
                  color={vars.color_primary_text_accent}
                />
              </div>
              <div>
                <sc.Argument>{historyEntry.argument}</sc.Argument>
                <sc.Time>{dateFormatter.format(historyEntry.date)}</sc.Time>
              </div>
            </sc.Entry>
          );
        })
      )}
    </sc.List>
  );
}

function getIconComponent(name) {
  switch (name) {
    case 'browser:open':
      return BrowserIcon;
    case 'path:open':
      return PathIcon;
    default:
      return PathIcon;
  }
}

const sc = {};

sc.List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

sc.Entry = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  background-color: ${vars.color_background_panel};
  box-shadow: ${vars.box_shadow_default};
  word-break: break-all;
  overflow: hidden;
  border-radius: 3px;
`;

sc.Argument = styled.div`
  color: ${vars.color_primary_text};
`;

sc.Time = styled.div`
  color: ${vars.color_primary_text_accent};
  font-weight: 500;
  margin-top: 8px;
`;

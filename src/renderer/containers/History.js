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
    <history.list>
      {historyList.map((historyEntry, index) => {
        const IconComponent = getIconComponent(historyEntry.name);

        return (
          <history.entry key={index}>
            <div>
              <IconComponent size={24} color={vars.color_primary_text_accent} />
            </div>
            <div>
              <history.argument>{historyEntry.argument}</history.argument>
              <history.time>
                {dateFormatter.format(historyEntry.date)}
              </history.time>
            </div>
          </history.entry>
        );
      })}
    </history.list>
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

const history = {
  list: styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  entry: styled.li`
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
  `,
  argument: styled.div`
    color: ${vars.color_primary_text};
  `,
  time: styled.div`
    color: ${vars.color_primary_text_accent};
    font-weight: 500;
    margin-top: 8px;
  `,
};

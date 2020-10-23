import React from 'react';
import styled from 'styled-components';

import { VAR, VARIABLES } from '../theme/GlobalStyles';

import { useConnectionList } from '../store/connectionStore';

export function Connections() {
  const connectionList = useConnectionList();

  return (
    <connections.list>
      {connectionList.map((connectionEntry) => {
        return (
          <connections.entry
            key={connectionEntry.id}
            title={connectionEntry.cloudId}
            connected={connectionEntry.connected}
          >
            {connectionEntry.name}
          </connections.entry>
        );
      })}
    </connections.list>
  );
}

const connections = {
  list: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  `,
  entry: styled.div`
    position: relative;
    font-weight: 700;
    font-size: 22px;
    line-height: 22px;
    margin-left: 24px;
    color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -24px;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      background-color: ${(props) =>
        props.connected
          ? VAR(VARIABLES.COLOR_GREEN)
          : VAR(VARIABLES.COLOR_RED)};
      border-radius: 50%;
    }
  `,
};

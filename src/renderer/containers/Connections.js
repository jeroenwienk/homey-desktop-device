import React from 'react';
import styled from 'styled-components';

import { VAR, VARIABLES } from '../theme/GlobalStyles';

import { socketStore } from '../store/socketStore';

export function Connections() {
  const connections = socketStore((state) => state.connections);

  return (
    <ConnectionsList>
      {connections.map((connection) => {
        return (
          <ConnectionEntry
            key={connection.id}
            title={connection.cloudId}
            connected={connection.connected}
          >
            {connection.name}
          </ConnectionEntry>
        );
      })}
    </ConnectionsList>
  );
}

const ConnectionsList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const ConnectionEntry = styled.div`
  position: relative;
  font-weight: 700;
  font-size: 22px;
  line-height: 26px;
  margin-left: 24px;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};

  &:before {
    content: '';
    position: absolute;
    top: 55%;
    left: -24px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-color: ${(props) =>
      props.connected ? VAR(VARIABLES.COLOR_GREEN) : VAR(VARIABLES.COLOR_RED)};
    border-radius: 50%;
  }
`;

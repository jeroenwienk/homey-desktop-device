import React from 'react';
import styled from 'styled-components';

import { vars } from '../theme/GlobalStyles';

import { useConnectionList } from '../store/connectionStore';

export function Connections() {
  const connectionList = useConnectionList();

  return (
    <sc.List>
      {connectionList.map((connectionEntry) => {
        return (
          <sc.Entry
            key={connectionEntry.id}
            title={connectionEntry.cloudId}
            connected={connectionEntry.connected}
          >
            {connectionEntry.name}
          </sc.Entry>
        );
      })}
    </sc.List>
  );
}

const sc = {};

sc.List = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

sc.Entry = styled.div`
  position: relative;
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
  margin-left: 24px;
  color: ${vars.color_primary_text};

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -24px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-color: ${(props) =>
      props.connected ? vars.color_green : vars.color_red};
    border-radius: 50%;
  }
`;

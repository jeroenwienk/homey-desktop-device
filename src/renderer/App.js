import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { historyStore } from './historyStore';

export function App() {
  const commands = historyStore((state) => state.commands);

  useEffect(() => {
    ipcRenderer.send('init', {});
  }, []);

  return (
    <Container>
      <Heading>Recent Commands</Heading>
      {commands.map((command, index) => {
        return (
          <Command key={index}>
            {command.name} : {command.argument}
          </Command>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: rgba(41, 41, 41, 1);
`;

const Heading = styled.h3`
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
  margin: 0;
  padding: 0;
  color: rgba(255, 255, 255, 1);
`;

const Command = styled.div`
  padding: 8px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

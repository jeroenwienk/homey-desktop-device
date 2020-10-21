import React from 'react';
import styled from 'styled-components';

import { buttonStore } from '../store/buttonStore';
import { acceleratorStore } from '../store/acceleratorStore';
import { VARIABLES, VAR } from '../theme/GlobalStyles';

import { WarningIcon, ErrorIcon } from '../components/common/IconMask';

export function Broken() {
  const brokenButtons = buttonStore((state) => state.broken);
  const brokenAccelerators = acceleratorStore((state) => state.broken);

  return (
    <Container>
      {brokenButtons.map((brokenButton) => {
        if (!brokenButton.button) {
          return (
            <BrokenEntry key={brokenButton.flow.id}>
              <ErrorIcon color={VAR(VARIABLES.COLOR_RED)}/>
              <div>
                <div>
                  <strong>Flow: </strong>
                  {brokenButton.flow.name}
                </div>
                <Message>
                  The Flow is broken because the button no longer exists.
                </Message>
              </div>
            </BrokenEntry>
          );
        }

        return (
          <BrokenEntry key={brokenButton.flow.id}>
            <WarningIcon color={VAR(VARIABLES.COLOR_YELLOW)} />
            <div>
              <div>
                <strong>Flow: </strong>
                {brokenButton.flow.name}
              </div>
              <div>{parseBrokenButton(brokenButton)}</div>
              <Message>
                The Flow isn't broken but it's arguments no longer match. Update
                and save the Flow.
              </Message>
            </div>
          </BrokenEntry>
        );
      })}
      {brokenAccelerators.map((brokenAccelerator) => {
        if (!brokenAccelerator.accelerator) {
          return (
            <BrokenEntry key={brokenAccelerator.flow.id}>
              <ErrorIcon color={VAR(VARIABLES.COLOR_RED)} />
              <div>
                <div>
                  <strong>Flow: </strong>
                  {brokenAccelerator.flow.name}
                </div>
                <Message>
                  The Flow is broken because the shortcut no longer exists.
                </Message>
              </div>
            </BrokenEntry>
          );
        }

        return (
          <BrokenEntry key={brokenAccelerator.flow.id}>
            <WarningIcon color={VAR(VARIABLES.COLOR_YELLOW)} />
            <div>
              <div>
                <strong>Flow: </strong>
                {brokenAccelerator.flow.name}
              </div>
              <div>{parseBrokenAccelerator(brokenAccelerator)}</div>
              <Message>
                The Flow isn't broken but it's arguments no longer match. Update
                and save the Flow.
              </Message>
            </div>
          </BrokenEntry>
        );
      })}
    </Container>
  );
}

function parseBrokenButton(brokenButton) {
  const buttonArg = brokenButton.flow.trigger.args.button;
  const button = brokenButton.button;

  const result = [];

  if (button.name !== buttonArg.name) {
    result.push({
      name: 'Name',
      expected: button.name,
      actual: buttonArg.name,
    });
  }

  if (button.description !== buttonArg.description) {
    result.push({
      name: 'Description',
      expected: button.description,
      actual: buttonArg.description,
    });
  }

  return result.map((entry, index) => {
    return (
      <div key={index}>
        <strong>{entry.name}:</strong> expected{' '}
        <Argument>{entry.expected}</Argument> actual{' '}
        <Argument>{entry.actual}</Argument>
      </div>
    );
  });
}

function parseBrokenAccelerator(brokenAccelerator) {
  const acceleratorArg = brokenAccelerator.flow.trigger.args.accelerator;
  const accelerator = brokenAccelerator.accelerator;

  const result = [];

  if (accelerator.keys !== acceleratorArg.name) {
    result.push({
      name: 'Name',
      expected: accelerator.keys,
      actual: acceleratorArg.name,
    });
  }

  return result.map((entry, index) => {
    return (
      <div key={index}>
        <strong>{entry.name}:</strong> expected{' '}
        <Argument>{entry.expected}</Argument> actual{' '}
        <Argument>{entry.actual}</Argument>
      </div>
    );
  });
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
`;

const BrokenEntry = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_PANEL)};
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};
  box-shadow: ${VAR(VARIABLES.BOX_SHADOW_DEFAULT)};
  border-radius: 3px;
  line-height: 22px;
`;

const Message = styled.div`
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)};
`;

const Argument = styled.div`
  display: inline-block;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)};
`;

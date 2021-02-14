import React from 'react';
import styled from 'styled-components';

import { buttonStore } from '../store/buttonStore';
import { acceleratorStore } from '../store/acceleratorStore';
import { displayStore } from '../store/displayStore';
import { vars } from '../theme/GlobalStyles';

import { WarningIcon, ErrorIcon } from '../components/common/IconMask';

export function Broken() {
  const brokenButtons = buttonStore((state) => state.broken);
  const brokenAccelerators = acceleratorStore((state) => state.broken);
  const brokenDisplays = displayStore((state) => state.broken);

  return (
    <sc.Container>
      {brokenButtons.map((brokenButton) => {
        if (!brokenButton.button) {
          return (
            <sc.BrokenEntry key={brokenButton.flow.id}>
              <ErrorIcon color={vars.color_red} />
              <div>
                <div>
                  <strong>Flow: </strong>
                  {brokenButton.flow.name}
                </div>
                <sc.Message>
                  The Flow is broken because the button no longer exists.
                </sc.Message>
              </div>
            </sc.BrokenEntry>
          );
        }

        return (
          <sc.BrokenEntry key={brokenButton.flow.id}>
            <WarningIcon color={vars.color_yellow} />
            <div>
              <div>
                <strong>Flow: </strong>
                {brokenButton.flow.name}
              </div>
              <div>{parseBrokenButton(brokenButton)}</div>
              <sc.Message>
                The Flow isn't broken but it's arguments no longer match. Update
                and save the Flow.
              </sc.Message>
            </div>
          </sc.BrokenEntry>
        );
      })}

      {brokenAccelerators.map((brokenAccelerator) => {
        if (!brokenAccelerator.accelerator) {
          return (
            <sc.BrokenEntry key={brokenAccelerator.flow.id}>
              <ErrorIcon color={vars.color_red} />
              <div>
                <div>
                  <strong>Flow: </strong>
                  {brokenAccelerator.flow.name}
                </div>
                <sc.Message>
                  The Flow is broken because the shortcut no longer exists.
                </sc.Message>
              </div>
            </sc.BrokenEntry>
          );
        }

        return (
          <sc.BrokenEntry key={brokenAccelerator.flow.id}>
            <WarningIcon color={vars.color_yellow} />
            <div>
              <div>
                <strong>Flow: </strong>
                {brokenAccelerator.flow.name}
              </div>
              <div>{parseBrokenAccelerator(brokenAccelerator)}</div>
              <sc.Message>
                The Flow isn't broken but it's arguments no longer match. Update
                and save the Flow.
              </sc.Message>
            </div>
          </sc.BrokenEntry>
        );
      })}

      {brokenDisplays.map((brokenDisplay) => {
        if (!brokenDisplay.display) {
          return (
            <sc.BrokenEntry key={brokenDisplay.flow.id}>
              <ErrorIcon color={vars.color_red} />
              <div>
                <div>
                  <strong>Flow: </strong>
                  {brokenDisplay.flow.name}
                </div>
                <sc.Message>
                  The Flow is broken because the display no longer exists.{' '}
                  <strong>{brokenDisplay.action.args.display.name}</strong>
                </sc.Message>
              </div>
            </sc.BrokenEntry>
          );
        }

        return (
          <sc.BrokenEntry key={brokenDisplay.flow.id}>
            <WarningIcon color={vars.color_yellow} />
            <div>
              <div>
                <strong>Flow: </strong>
                {brokenDisplay.flow.name}
              </div>
              <div>{parseBrokenDisplay(brokenDisplay)}</div>
              <sc.Message>
                The Flow isn't broken but it's arguments no longer match. Update
                and save the Flow.
              </sc.Message>
            </div>
          </sc.BrokenEntry>
        );
      })}
    </sc.Container>
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
        <sc.Argument>{entry.expected}</sc.Argument>
        actual <sc.Argument>{entry.actual}</sc.Argument>
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
        <sc.Argument>{entry.expected}</sc.Argument>
        actual <sc.Argument>{entry.actual}</sc.Argument>
      </div>
    );
  });
}

function parseBrokenDisplay(brokenDisplay) {
  // todo
  const displayArg = brokenDisplay.action.args.display;
  const display = brokenDisplay.display;

  const result = [];

  if (display.name !== displayArg.name) {
    result.push({
      name: 'Name',
      expected: display.name,
      actual: displayArg.name,
    });
  }

  if (display.description !== displayArg.description) {
    result.push({
      name: 'Description',
      expected: display.description,
      actual: displayArg.description,
    });
  }

  return result.map((entry, index) => {
    return (
      <div key={index}>
        <strong>{entry.name}:</strong> expected{' '}
        <sc.Argument>{entry.expected}</sc.Argument>
        actual <sc.Argument>{entry.actual}</sc.Argument>
      </div>
    );
  });
}

const sc = {};

sc.Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
`;

sc.BrokenEntry = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background-color: ${vars.color_background_panel};
  color: ${vars.color_primary_text};
  box-shadow: ${vars.box_shadow_default};
  border-radius: 3px;
  line-height: 22px;
`;

sc.Message = styled.div`
  color: ${vars.color_primary_text_accent};
`;

sc.Argument = styled.div`
  display: inline-block;
  color: ${vars.color_primary_text_accent};
`;

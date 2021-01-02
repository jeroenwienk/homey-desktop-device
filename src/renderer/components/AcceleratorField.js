import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import { useLabel, useKeyboard } from 'react-aria';

import { mergeRefs } from '../lib/mergeRefs';
import { vars } from '../theme/GlobalStyles';

import { Clear } from './common/IconButton';

const order = ['Control', 'Command', 'Super', 'Alt', 'AltGr', 'Shift'];

function keyCompare(a, b) {
  if (order.indexOf(a) === -1) return 1;
  if (order.indexOf(b) === -1) return -1;
  return order.indexOf(a) - order.indexOf(b);
}

export function AcceleratorField(props) {
  const acceleratorFieldRef = useRef();
  const register = props.register?.({
    required: true,
  });

  const label = useLabel({
    label: props.label,
    'aria-label': props.label,
  });

  const [state, setState] = useState(() => {
    if (props.defaultValue === '') return {};

    return props.defaultValue.split(' ').reduce((accumulator, value) => {
      accumulator[value] = true;
      return accumulator;
    }, {});
  });

  const keyboard = useKeyboard({
    onKeyDown: (event) => {
      let key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      const code = event.code;

      if (key === 'Tab' || key === 'Escape') {
        event.continuePropagation();
        return;
      }

      if (key === 'Meta') {
        key = 'Super';
      }

      if (key === 'AltGraph') {
        key = 'AltGr';
      }

      if (key.startsWith('Arrow')) {
        key = key.substring(5);
      }

      if (code.startsWith('Numpad')) {
        key = `num${code.substring(6, 9).toLowerCase()}`;
      }

      setState((prevState) => {
        if (key.length === 1) {
          Object.keys(prevState).forEach((prevKey) => {
            if (prevKey.length === 1) {
              delete prevState[prevKey];
            }
          });
        }

        return {
          ...prevState,
          [key]: true,
        };
      });
    },
  });

  useEffect(() => {
    if (acceleratorFieldRef.current) {
      acceleratorFieldRef.current.value = Object.keys(state)
        .map((key) => {
          return key.length === 1 ? key.toUpperCase() : key;
        })
        .sort(keyCompare)
        .join(' ');
    }
  }, [state]);

  return (
    <Container>
      <LabelContainer>
        <Label {...label.labelProps}>{props.label}</Label>
        <Clear
          size={24}
          onPress={() => {
            setState({});
          }}
        />
      </LabelContainer>
      <Input
        {...label.fieldProps}
        {...keyboard.keyboardProps}
        readOnly
        autoFocus
        name={props.name}
        defaultValue={props.defaultValue}
        hasError={props.error != null}
        ref={mergeRefs([acceleratorFieldRef, register])}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.label`
  color: ${vars.color_primary_text};
  font-weight: 500;
`;

const Input = styled.input`
  position: relative;
  display: block;
  min-width: 256px;
  height: 48px;
  padding: 8px;
  color: ${vars.color_primary_text};
  background-color: ${vars.color_background_input};
  border: 1px solid ${vars.color_background_input};
  border-radius: 3px;
  outline: ${(props) => props.hasError && vars.border_error};

  &:focus {
    outline: ${vars.border_focus};
  }
`;

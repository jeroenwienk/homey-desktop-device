import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import { useLabel } from '@react-aria/label';
import { useKeyboard } from '@react-aria/interactions';

import { mergeRefs } from '../lib/mergeRefs';
import { VAR, VARIABLES } from '../theme/GlobalStyles';

import { ClearIconButton } from './common/IconButton';

const order = ['Control', 'Command', 'Super', 'Alt', 'Shift'];

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

  let label = useLabel({
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

      if (key === 'Meta') {
        key = 'Super';
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
      <Label {...label.labelProps}>{props.label}</Label>
      <InputContainer>
        <Input
          {...label.fieldProps}
          {...keyboard.keyboardProps}
          readOnly
          name={props.name}
          defaultValue={props.defaultValue}
          hasError={props.error != null}
          ref={mergeRefs([acceleratorFieldRef, register])}
        />
        <ClearIconButton
          onClick={() => {
            setState({});
          }}
        />
      </InputContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};
  font-weight: 500;
`;

const Input = styled.input`
  position: relative;
  display: block;
  min-width: 256px;
  height: 48px;
  padding: 8px;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_DARK)};
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_LIGHT)};
  outline: ${(props) => props.hasError && VAR(VARIABLES.BORDER_ERROR)};

  &:focus {
    outline: ${VAR(VARIABLES.BORDER_FOCUS)};
  }
`;

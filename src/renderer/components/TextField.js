import React, { useRef } from 'react';
import styled from 'styled-components';

import { useTextField } from '@react-aria/textfield';

import { mergeRefs } from '../lib/mergeRefs';
import { VAR, VARIABLES } from '../theme/GlobalStyles';

export function TextField(props) {
  const register = props.register?.({
    required: props.required,
    minLength: props.minLength,
  });

  const textFieldRef = useRef();
  const textField = useTextField(
    {
      isRequired: props.required,
      minLength: props.minLength,
      name: props.name,
      autoFocus: props.autoFocus,
      type: 'text',
      placeholder: props.label,
      defaultValue: props.defaultValue,
      'aria-label': props.label,
    },
    textFieldRef
  );

  return (
    <Container>
      <Label {...textField.labelProps}>{props.label}</Label>
      <Input
        {...textField.inputProps}
        hasError={props.error != null}
        ref={mergeRefs([textFieldRef, register])}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};
  background-color: ${VAR(VARIABLES.COLOR_BACKGROUND_INPUT)};
  border: 1px solid ${VAR(VARIABLES.COLOR_BACKGROUND_INPUT)};
  border-radius: 3px;
  outline: ${(props) => props.hasError && VAR(VARIABLES.BORDER_ERROR)};
`;

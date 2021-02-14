import React, { useRef } from 'react';
import styled from 'styled-components';

import { useTextField } from 'react-aria';

import { mergeRefs } from '../lib/mergeRefs';
import { vars } from '../theme/GlobalStyles';

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
    <sc.Container>
      <sc.Label {...textField.labelProps}>{props.label}</sc.Label>
      <sc.Input
        {...textField.inputProps}
        hasError={props.error != null}
        ref={mergeRefs([textFieldRef, register])}
      />
    </sc.Container>
  );
}

const sc = {};

sc.Container = styled.div`
  display: flex;
  flex-direction: column;
`;

sc.Label = styled.label`
  margin-bottom: 8px;
  color: ${vars.color_primary_text};
  font-weight: 500;
`;

sc.Input = styled.input`
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
`;

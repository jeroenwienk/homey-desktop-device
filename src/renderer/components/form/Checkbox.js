import React, { useRef } from 'react';

import { useToggleState } from 'react-stately';
import { useCheckbox } from 'react-aria';

import { mergeRefs } from '../../lib/mergeRefs';
import styled from 'styled-components';

export function Checkbox(props) {
  const checkboxRef = useRef();

  const checkboxProps = {
    ...props,
    children: props.label,
  };

  const state = useToggleState(checkboxProps);
  let checkbox = useCheckbox(checkboxProps, state, checkboxRef);

  const register = props.register?.({
    required: props.required,
  });

  return (
    <Checkbox.Root style={{ display: 'block' }}>
      <input
        {...checkbox.inputProps}
        ref={mergeRefs([checkboxRef, register])}
      />
      <Checkbox.Text>{props.label}</Checkbox.Text>
    </Checkbox.Root>
  );
}

Checkbox.Root = styled.label`
  display: block;
`;

Checkbox.Text = styled.span`
  display: inline-block;
  padding-left: 8px;
`;

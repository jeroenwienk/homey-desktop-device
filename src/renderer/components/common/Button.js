import React, { useRef } from 'react';
import styled from 'styled-components';

import { mergeProps } from '@react-aria/utils';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';

import { VAR, VARIABLES } from '../../theme/GlobalStyles';

import { ButtonBase } from './ButtonBase';

export function Button(props) {
  const buttonRef = useRef();
  const button = useButton(props);
  const focusRing = useFocusRing();

  const backgroundColor = focusRing.isFocusVisible
    ? VAR(VARIABLES.COLOR_FOCUS)
    : VAR(VARIABLES.COLOR_BACKGROUND_BUTTON);

  return (
    <Base
      {...mergeProps(button.buttonProps, focusRing.focusProps)}
      ref={buttonRef}
      type={props.type}
      form={props.form}
      isFocusVisible={focusRing.isFocusVisible}
      backgroundColor={backgroundColor}
    >
      {props.children}
    </Base>
  );
}

const Base = styled(ButtonBase)`
  height: 40px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 3px;
`;

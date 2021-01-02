import React, { useRef } from 'react';
import styled from 'styled-components';

import { useButton, useFocusRing, mergeProps } from 'react-aria';

import { vars } from '../../theme/GlobalStyles';

import { ButtonBase } from './ButtonBase';

export function Button(props) {
  const buttonRef = useRef();
  const button = useButton(props);
  const focusRing = useFocusRing();

  const backgroundColor = focusRing.isFocusVisible
    ? vars.color_focus
    : vars.color_background_button;

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

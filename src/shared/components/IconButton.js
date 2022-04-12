import React, { forwardRef, useRef } from 'react';

import { useButton, useFocusRing, mergeProps } from 'react-aria';

import { mergeRefs } from '../lib/mergeRefs';
import { vars } from '../theme/GlobalStyles';

import { ButtonBase } from './ButtonBase';
import { Icon } from './Icon';

export const IconButton = forwardRef((props, forwardedRef) => {
  const buttonRef = useRef();
  const button = useButton(props);
  const focusRing = useFocusRing();

  const color = focusRing.isFocusVisible ? vars.color_focus : props.color;

  return (
    <ButtonBase {...mergeProps(focusRing.focusProps, button.buttonProps)} ref={mergeRefs([buttonRef, forwardedRef])}>
      {props.iconComponent ? (
        <props.iconComponent ref={props.iconRef} color={color} size={props.size} />
      ) : (
        <Icon ref={props.iconRef} url={props.url} color={color} size={props.size} />
      )}
    </ButtonBase>
  );
});

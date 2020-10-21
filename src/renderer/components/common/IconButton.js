import React, { forwardRef, useRef } from 'react';

import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

import { mergeRefs } from '../../lib/mergeRefs';
import { VAR, VARIABLES } from '../../theme/GlobalStyles';

import { ButtonBase } from './ButtonBase';
import {
  IconMask,
  AddIcon,
  SaveIcon,
  CancelIcon,
  RemoveIcon,
  ClearIcon,
} from './IconMask';

export const IconButton = forwardRef((props, forwardedRef) => {
  const buttonRef = useRef();
  const button = useButton(props);
  const focusRing = useFocusRing();

  const color = focusRing.isFocusVisible
    ? VAR(VARIABLES.COLOR_FOCUS)
    : props.color;

  return (
    <ButtonBase
      {...mergeProps(focusRing.focusProps, button.buttonProps)}
      ref={mergeRefs([buttonRef, forwardedRef])}
    >
      {props.iconComponent ? (
        <props.iconComponent
          ref={props.iconRef}
          color={color}
          size={props.size}
        />
      ) : (
        <IconMask
          ref={props.iconRef}
          mask={props.mask}
          color={color}
          size={props.size}
        />
      )}
    </ButtonBase>
  );
});

export const Add = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={AddIcon} />
));

export const Save = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={SaveIcon} />
));

export const Cancel = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={CancelIcon} />
));

export const Remove = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={RemoveIcon} />
));

export const Clear = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={ClearIcon} />
));

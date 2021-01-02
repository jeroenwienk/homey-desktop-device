import React, { forwardRef, useRef } from 'react';

import { useButton, useFocusRing, mergeProps } from 'react-aria';

import { mergeRefs } from '../../lib/mergeRefs';
import { vars } from '../../theme/GlobalStyles';

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

  const color = focusRing.isFocusVisible ? vars.color_focus : props.color;

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

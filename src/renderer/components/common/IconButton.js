import React, { forwardRef } from 'react';

import { ButtonBase } from './ButtonBase';
import { IconMask, AddIcon, SaveIcon, CancelIcon } from './IconMask';

export const IconButton = forwardRef((props, forwardedRef) => (
  <ButtonBase
    ref={forwardedRef}
    onClick={props.onClick}
    type={props.type}
    form={props.form}
  >
    {props.iconComponent ? (
      <props.iconComponent ref={props.iconRef} color={props.color} />
    ) : (
      <IconMask ref={props.iconRef} mask={props.mask} color={props.color} />
    )}
  </ButtonBase>
));

export const AddIconButton = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={AddIcon} />
));

export const SaveIconButton = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={SaveIcon} />
));

export const CancelIconButton = forwardRef((props, forwardedRef) => (
  <IconButton {...props} ref={forwardedRef} iconComponent={CancelIcon} />
));

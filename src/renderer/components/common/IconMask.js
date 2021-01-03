import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { vars } from '../../theme/GlobalStyles';

import add from '../../../assets/actions/add.svg';
import save from '../../../assets/actions/save.svg';
import cancel from '../../../assets/actions/cancel.svg';
import remove from '../../../assets/actions/remove.svg';
import clear from '../../../assets/actions/clear.svg';
import drag from '../../../assets/actions/drag.svg';

import nolink from '../../../assets/status/nolink.svg';
import warning from '../../../assets/status/warning.svg';
import error from '../../../assets/status/error.svg';

import browser from '../../../assets/history/browser.svg';
import path from '../../../assets/history/path.svg';

export const IconMask = styled.div`
  display: inline-block;
  mask-image: url(${(props) => props.mask});
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  width: ${(props) => props.size ?? 48}px;
  height: ${(props) => props.size ?? 48}px;
  background-color: ${(props) => props.color ?? vars.color_icon_light};
`;

export const AddIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={add} />
));

export const SaveIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={save} />
));

export const CancelIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={cancel} />
));

export const RemoveIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={remove} />
));

export const ClearIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={clear} />
));

export const BrowserIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={browser} />
));

export const PathIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={path} />
));

export const NoLinkIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={nolink} />
));

export const ErrorIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={error} />
));

export const WarningIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={warning} />
));

export const DragIcon = forwardRef((props, forwardedRef) => (
  <IconMask {...props} ref={forwardedRef} mask={drag} />
));

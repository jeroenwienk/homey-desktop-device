import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { VAR, VARIABLES } from '../../theme/GlobalStyles';

import add from '../../../assets/actions/add.svg';
import save from '../../../assets/actions/save.svg';
import cancel from '../../../assets/actions/cancel.svg';
import remove from '../../../assets/actions/remove.svg';
import clear from '../../../assets/actions/clear.svg';

export const IconMask = styled.div`
  display: inline-block;
  mask-image: url(${(props) => props.mask});
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  width: 48px;
  height: 48px;
  background-color: ${(props) =>
    props.color ?? VAR(VARIABLES.COLOR_ICON_LIGHT)};
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

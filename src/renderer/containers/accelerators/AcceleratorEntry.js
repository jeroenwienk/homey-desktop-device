import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';

import { mergeProps } from '@react-aria/utils';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';

import { vars } from '../../theme/GlobalStyles';
import { mergeRefs } from '../../lib/mergeRefs';

export const AcceleratorEntry = forwardRef(function (props, forwardedRef) {
  const buttonRef = useRef();
  const button = useButton({ ...props, id: props.accelerator.id }, buttonRef);
  const focusRing = useFocusRing();

  return (
    <ButtonBase
      {...mergeProps(focusRing.focusProps, button.buttonProps)}
      ref={mergeRefs([buttonRef, forwardedRef])}
      isFocusVisible={focusRing.isFocusVisible}
      onContextMenu={props.onContextMenu}
    >
      <div className="top" />
      <div className="name" title={props.accelerator.keys}>
        {props.accelerator.keys}
      </div>
    </ButtonBase>
  );
});

const ButtonBase = styled.button`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: stretch;
  width: 128px;
  height: 128px;
  padding: 8px;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${vars.color_background_button};
  color: ${vars.color_primary_text_accent};
  box-shadow: ${vars.box_shadow_default};

  &:active {
    transform: scale(0.95);
  }

  &:after {
    content: '';
    display: ${(props) => (props.isFocusVisible ? 'block' : 'none')};
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    border: 2px solid ${vars.color_focus};
    background-color: ${vars.color_focus_accent};
    border-radius: 10px;
  }

  .name {
    flex: 0 1 auto;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .top {
    flex: 1 1 auto;
  }
`;

import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';

import { useButton, useFocusRing, mergeProps } from 'react-aria';

import { vars } from '../../theme/GlobalStyles';
import { mergeRefs } from '../../lib/mergeRefs';

import { IconButton } from '../../components/common/IconButton';
import { SettingsIcon } from '../../components/common/IconMask';

export const DisplayEntry = forwardRef(function (props, forwardedRef) {
  const buttonRef = useRef();
  const button = useButton(
    { ...props, elementType: 'div', id: props.display.id },
    buttonRef
  );
  const focusRing = useFocusRing();

  function handleSettingsPress(event) {
    props.onContextMenu();
  }

  return (
    <sc.ButtonBase
      {...mergeProps(focusRing.focusProps, button.buttonProps)}
      ref={mergeRefs([buttonRef, forwardedRef])}
      isFocusVisible={focusRing.isFocusVisible}
      onContextMenu={props.onContextMenu}
    >
      <sc.Top>
        <IconButton
          onPress={handleSettingsPress}
          size={vars.icon_size_small}
          iconComponent={SettingsIcon}
        />
      </sc.Top>
      <sc.Name title={props.display.name}>{props.display.name}</sc.Name>
    </sc.ButtonBase>
  );
});

const sc = {};

sc.ButtonBase = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: stretch;
  height: 64px;
  padding: 8px;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${vars.color_background_button};
  color: ${vars.color_primary_text};
  border: ${vars.border_button};
  min-width: 0;

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
`;

sc.Top = styled.div`
  flex: 1 1 auto;
  align-self: flex-end;
`;

sc.Name = styled.div`
  flex: 0 1 auto;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  overflow: hidden;
`;

import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { Item, useTreeState, useMenuTriggerState } from 'react-stately';
import {
  useMenuTrigger,
  useMenu,
  useMenuItem,
  useFocus,
  useOverlay,
  DismissButton,
  FocusScope,
  mergeProps,
} from 'react-aria';

import { vars } from '../../theme/GlobalStyles';

import { Add } from './IconButton';

MenuButton.Item = Item;

export function MenuButton(props) {
  const menuTriggerRef = React.useRef();
  const menuTriggerState = useMenuTriggerState({});
  const menuTrigger = useMenuTrigger(
    { type: 'menu' },
    menuTriggerState,
    menuTriggerRef
  );

  return (
    <MenuButtonContainer>
      <Add
        {...menuTrigger.menuTriggerProps}
        ref={menuTriggerRef}
        aria-label={props.label}
      />
      {menuTriggerState.isOpen && (
        <MenuPopup
          label={props.label}
          menuTrigger={menuTrigger}
          onClose={menuTriggerState.close}
          onAction={props.onAction}
        >
          {props.children}
        </MenuPopup>
      )}
    </MenuButtonContainer>
  );
}

function MenuPopup(props) {
  const menuRef = useRef();
  const overlayRef = useRef();

  const treeState = useTreeState({
    selectionMode: 'none',
    children: props.children,
  });

  const menu = useMenu(
    {
      // children: props.children,
      // onAction: props.onAction,
      autoFocus: true,
      shouldFocusWrap: true,
      'aria-label': props.label,
    },
    treeState,
    menuRef
  );

  const overlay = useOverlay(
    {
      onClose: props.onClose,
      shouldCloseOnBlur: false,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef
  );

  return (
    <FocusScope restoreFocus contain>
      <MenuPopupOverlay {...overlay.overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={props.onClose} />
        <MenuList
          {...mergeProps(menu.menuProps, props.menuTrigger.menuProps)}
          ref={menuRef}
        >
          {[...treeState.collection].map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              treeState={treeState}
              onAction={props.onAction}
              onClose={props.onClose}
            />
          ))}
        </MenuList>
        <DismissButton onDismiss={props.onClose} />
      </MenuPopupOverlay>
    </FocusScope>
  );
}

function MenuItem({ item, treeState, onAction, onClose }) {
  const menuItemRef = useRef();
  const menuItem = useMenuItem(
    {
      key: item.key,
      isDisabled: item.isDisabled,
      'aria-label': item.textValue,
      closeOnSelect: true,
      onAction,
      onClose,
    },
    treeState,
    menuItemRef
  );

  const [isFocused, setFocused] = useState(false);
  const focus = useFocus({ onFocusChange: setFocused });

  return (
    <MenuItemListItem
      {...mergeProps(menuItem.menuItemProps, focus.focusProps)}
      ref={menuItemRef}
      isFocused={isFocused}
    >
      {item.rendered}
    </MenuItemListItem>
  );
}

const MenuButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MenuPopupOverlay = styled.div`
  position: absolute;
  left: 24px;
  top: 48px;
  background-color: ${vars.color_background_panel};
  border-radius: 3px;
  box-shadow: ${vars.box_shadow_default};
`;

const MenuList = styled.ul`
  min-width: 256px;
`;

const MenuItemListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  outline: 0;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) =>
    props.isFocused ? vars.color_focus : vars.color_primary_text};

  &:hover {
    background-color: ${vars.color_hover};
  }
`;

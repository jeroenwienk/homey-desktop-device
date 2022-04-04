import React from 'react';
import styled from 'styled-components';

import { useOptionContext } from './ListBox';

export function Item(props) {
  const { ref, option, state, item } = useOptionContext();

  return (
    <Item.Root
      {...option.optionProps}
      ref={ref}
      className={props.className}
      style={props.style}
      as={props.as}
      data-is-selected={option.isSelected}
      data-is-focused={option.isFocused}
      data-is-pressed={option.isPressed}
      data-is-disabled={option.isDisabled}
    >
      <Item.Inner>
        <Item.Name>{item.textValue}</Item.Name>
      </Item.Inner>
    </Item.Root>
  );
}

Item.Name = styled.div`
  flex: 1 1 auto;
  padding-left: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

Item.Inner = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
`;

Item.Root = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  outline: 0;
  cursor: pointer;

  &[data-is-selected='true'] {
    color: green;
  }

  &[data-is-disabled='true'] {
    color: gray;
  }

  &[data-is-focused='true'] {
    color: cyan;
    background-color: rgba(0, 0, 0, 0.1);
  }

  &[data-is-pressed='true'] {
    color: greenyellow;
  }
`;

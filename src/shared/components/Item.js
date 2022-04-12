import React from 'react';
import styled from 'styled-components';

import { useOptionContext } from './ListBox';

export function Item(props) {
  // eslint-disable-next-line no-unused-vars
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
      <Item.Content>
        <Item.Main>
          <Item.Name>{item.textValue}</Item.Name>
        </Item.Main>
      </Item.Content>
    </Item.Root>
  );
}

Item.Content = styled.div`
  flex: 1 1 auto;
  position: relative;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  padding: 4px 0 4px 0;
`;

Item.Name = styled.div`
  flex: 1 1 auto;
  padding-left: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

Item.Main = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`;

Item.Root = styled.li`
  display: flex;
  outline: 0;
  cursor: pointer;
  min-height: 24px;

  &[data-is-selected='true'] {
    color: green;
  }

  &[data-is-disabled='true'] {
    color: gray;
  }

  &[data-is-focused='true'] {
    color: rgba(0, 130, 250, 1);
    background-color: #e6f3ff;
  }

  &[data-is-pressed='true'] {
    color: #0075e0;
  }
`;

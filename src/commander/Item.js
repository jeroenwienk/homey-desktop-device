import React from 'react';
import styled from 'styled-components';

import { useOptionContext } from './ListBox';

export function Item(props) {
  const { ref, option, state, item } = useOptionContext();

  const description = item.value.description;

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
      <Item.Main>
        <Item.Name>{item.textValue}</Item.Name>
        <Item.Hint>{item.value.hint}</Item.Hint>
      </Item.Main>
      {description != null && (
        <Item.Description>{description}</Item.Description>
      )}
    </Item.Root>
  );
}

Item.Name = styled.div`
  flex: 1 1 auto;
  padding-left: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

Item.Hint = styled.div`
  flex: 1 1 auto;
  padding-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
`;

Item.Description = styled.div`
  width: 100%;
  padding: 16px 8px 8px;
  color: black;
`;

Item.Main = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`;

Item.Root = styled.li`
  position: relative;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  padding: 4px;
  outline: 0;
  cursor: pointer;

  &[data-is-selected='true'] {
    color: green;
  }

  &[data-is-disabled='true'] {
    color: gray;
  }

  &[data-is-focused='true'] {
    color: rgba(0, 130, 250, 1.00);
    background-color: #E6F3FF;
  }

  &[data-is-pressed='true'] {
    color: #0075E0;
  }
`;

import React from 'react';
import styled from 'styled-components';

import { useOptionContext } from './ListBox';

// import { vars } from '../../theme/GlobalStyles';

import { Icon } from './Icon';

// import iconExpandable from '../../../assets/status/expandable.svg';

export function Item(props) {
  // eslint-disable-next-line no-unused-vars
  const { ref, option, state, item } = useOptionContext();

  const description = item.value.description;
  const type = item.value.type;

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
      <Item.IndicatorLeft data-is-visible={false} />
      <Item.Content>
        <Item.Main>
          <Item.Name>{item.textValue}</Item.Name>
          <Item.Hint>{item.value.hint}</Item.Hint>
        </Item.Main>
        {description != null && <Item.Description>{description}</Item.Description>}
      </Item.Content>
      <Item.IndicatorRight data-is-visible={option.isFocused && type != null}>
        {/*{option.isFocused && type != null && (*/}
        {/*  <Icon url={iconExpandable} color="rgba(0, 130, 250, 1)" size={vars.icon_size_small} />*/}
        {/*)}*/}
      </Item.IndicatorRight>
    </Item.Root>
  );
}

Item.IndicatorLeft = styled.div`
  position: relative;
  flex: 0 0 4px;
  max-width: 4px;

  &[data-is-visible='true'] {
    // background-color: rgba(0, 130, 250, 1);
  }

  ${Icon.Root} {
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    position: absolute;
  }
`;

Item.IndicatorRight = styled.div`
  position: relative;
  flex: 0 0 2px;
  max-width: 2px;

  &[data-is-visible='true'] {
    background-color: rgba(0, 130, 250, 1);
  }

  ${Icon.Root} {
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    position: absolute;
  }
`;

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
  display: flex;
  outline: 0;
  cursor: pointer;

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

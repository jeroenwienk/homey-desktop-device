import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';

import { useComboBox } from './useComboBox';
import { useComboBoxState } from './useComboBoxState';

import { renderCollectionItem, renderCollectionSection } from '../shared/components/ListBox';
import { mergeRefs } from '../shared/lib/mergeRefs';

import { vars } from '../shared/theme/GlobalStyles';

import { ListBox as ListBoxBase } from '../shared/components/ListBox';
import { Spinner } from '../shared/components/Spinner';
import { SearchIcon } from '../shared/components/IconMask';

export const ComboBox = forwardRef((props, forwardedRef) => {
  const buttonRef = useRef();
  const inputRef = useRef();
  const listBoxRef = useRef();
  // const overlayRef = useRef();
  const overlayTargetRef = useRef();

  function onKeyDown(event) {
    props.onKeyDown?.(event, comboBoxState);
  }

  const sharedProps = {
    ...props,
    onKeyDown,
    children: props.renderSection != null ? renderCollectionSection : renderCollectionItem,
    onSelectionChange(key) {
      props.onSelectionChange(key, comboBoxState);
    },
  };

  const comboBoxState = useComboBoxState({
    ...sharedProps,
  });

  const item = comboBoxState.collection.getItem(comboBoxState.selectionManager.focusedKey);

  let placeholder = props.placeholder;
  if (item?.value.inputModeHint != null) {
    console.log(item);
    placeholder = item.value.inputModeHint;
  }

  const comboBox = useComboBox(
    {
      ...sharedProps,
      placeholder,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef: listBoxRef,
    },
    comboBoxState
  );

  return (
    <ComboBox.Root ref={forwardedRef}>
      {/*<ComboBox.Label {...comboBox.labelProps}>{props.label}</ComboBox.Label>*/}
      <ComboBox.InputContainer ref={overlayTargetRef}>
        <ComboBox.IconWrapper>
          {props.isLoading ? <Spinner size="20px" /> : <SearchIcon size={vars.icon_size_small} color="#d1d2d5" />}
        </ComboBox.IconWrapper>

        <ComboBox.PathChunkContainer>
          {props.path.map((entry) => {
            return (
              <ComboBox.PathChunk key={entry.key} title={entry.value.textValue}>
                {`${entry.value.textValue} /`}
              </ComboBox.PathChunk>
            );
          })}
        </ComboBox.PathChunkContainer>

        <ComboBox.Input {...comboBox.inputProps} ref={mergeRefs([inputRef, props.inputRef])} />
      </ComboBox.InputContainer>

      <ComboBox.Hint>Type ? for help and tips</ComboBox.Hint>

      <ComboBox.ListBox
        {...comboBox.listBoxProps}
        listBoxRef={listBoxRef}
        renderItem={props.renderItem}
        renderSection={props.renderSection}
        state={comboBoxState}
      />
    </ComboBox.Root>
  );
});

ComboBox.Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  background-color: #f6f7fb;
  border-radius: 4px;
  padding: 8px;
  border: 2px solid #dddee2;
`;

// ComboBox.Label = styled.label``;

ComboBox.IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
`;

ComboBox.PathChunkContainer = styled.div`
  display: flex;
`;

ComboBox.PathChunk = styled.div`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:not(:first-of-type) {
    padding-left: 8px;
  }

  &:last-of-type {
    padding-right: 8px;
  }
`;

ComboBox.InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #dddee2;
  border-radius: 4px;
`;

ComboBox.Input = styled.input`
  padding: 8px 8px 8px 0;
  flex: 1 1 auto;
  border: 1px solid transparent;

  //&:focus {
  //  border: 1px solid red;
  //}
`;

ComboBox.Hint = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 24px;
  color: #939496;
  font-size: 0.75rem;
`;

ComboBox.ListBox = styled(ListBoxBase)`
  height: 560px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #dddee2;
  border-radius: 4px;
`;

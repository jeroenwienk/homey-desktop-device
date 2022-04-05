import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';

import { useComboBox } from 'react-aria';
import { useComboBoxState } from './useComboBoxState';

import { ListBox as ListBoxBase } from './ListBox';

import { renderCollectionItem, renderCollectionSection } from './ListBox';
import { mergeRefs } from '../renderer/lib/mergeRefs';

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
    children:
      props.renderSection != null
        ? renderCollectionSection
        : renderCollectionItem,
    onSelectionChange(key) {
      props.onSelectionChange(key, comboBoxState);
    },
  };

  const comboBoxState = useComboBoxState({
    ...sharedProps,
  });

  const comboBox = useComboBox(
    {
      ...sharedProps,
      allowsCustomValue: true,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef: listBoxRef,
      stateRef: props.stateRef,
    },
    comboBoxState
  );

  return (
    <ComboBox.Root ref={forwardedRef}>
      <ComboBox.Label {...comboBox.labelProps}>{props.label}</ComboBox.Label>
      <ComboBox.InputContainer ref={overlayTargetRef}>
        {props.path.map((entry) => {
          return (
            <ComboBox.PathChunk key={entry.key} title={entry.value.textValue}>
              {`${entry.value.textValue} /`}
            </ComboBox.PathChunk>
          );
        })}

        <ComboBox.Input
          {...comboBox.inputProps}
          ref={mergeRefs([inputRef, props.inputRef])}
        />
      </ComboBox.InputContainer>

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
`;

ComboBox.Label = styled.label`
  color: white;
`;

ComboBox.PathChunk = styled.div`
  max-width: 120px;
  padding-right: 8px;
  color: white;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-child {
    padding-left: 8px;
  }
`;

ComboBox.Input = styled.input`
  padding: 8px 16px;
  flex: 1 1 auto;
`;

ComboBox.InputContainer = styled.div`
  display: flex;
  align-items: center;

  background-color: gray;
  width: 100%;
`;

ComboBox.ListBox = styled(ListBoxBase)`
  width: 600px;
  height: 400px;
  overflow-y: auto;
  margin-top: 8px;
  background-color: white;
`;

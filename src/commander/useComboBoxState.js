/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { useSingleSelectListState } from '@react-stately/list';
import { useControlledState } from '@react-stately/utils';
import { useEffect, useRef, useState } from 'react';
import { useMenuTriggerState } from '@react-stately/menu';

/**
 * Provides state management for a combo box component. Handles building a collection
 * of items from props and manages the option selection state of the combo box. In addition, it tracks the input value,
 * focus state, and other properties of the combo box.
 */
export function useComboBoxState(props) {
  const {
    allowsCustomValue,
    shouldCloseOnBlur = false, // OVERRIDE
  } = props;

  const [showAllItems, setShowAllItems] = useState(false);
  const [isFocused, setFocusedState] = useState(false);
  const [inputValue, setInputValue] = useControlledState(
    props.inputValue,
    props.defaultInputValue ?? '',
    props.onInputChange
  );

  const onSelectionChange = (key) => {
    if (props.onSelectionChange) {
      props.onSelectionChange(key);
    }

    // If key is the same, reset the inputValue and close the menu
    // (scenario: user clicks on already selected option)
    if (key === selectedKey) {
      resetInputValue();
    }
  };

  const {
    collection,
    selectionManager,
    selectedKey,
    setSelectedKey,
    selectedItem,
    disabledKeys,
  } = useSingleSelectListState({
    ...props,
    onSelectionChange,
    items: props.items ?? props.defaultItems,
  });

  // Preserve original collection so we can show all items on demand
  const originalCollection = collection;
  const filteredCollection = collection;

  const triggerState = useMenuTriggerState({
    ...props,
    isOpen: true, // OVERRIDE
    defaultOpen: undefined, // OVERRIDE
  });

  const open = (focusStrategy, trigger) => {};
  const toggle = (focusStrategy, trigger) => {};

  let lastValue = useRef(inputValue);
  let resetInputValue = () => {
    let itemText = collection.getItem(selectedKey)?.textValue ?? '';
    lastValue.current = itemText;
    setInputValue(itemText);
  };

  let isInitialRender = useRef(true);
  let lastSelectedKey = useRef(
    props.selectedKey ?? props.defaultSelectedKey ?? null
  );
  let lastSelectedKeyText = useRef(
    collection.getItem(selectedKey)?.textValue ?? ''
  );
  // intentional omit dependency array, want this to happen on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Clear focused key when input value changes and display filtered collection again.
    if (inputValue !== lastValue.current) {
      selectionManager.setFocusedKey(null);
      setShowAllItems(false);

      // Set selectedKey to null when the user clears the input.
      // If controlled, this is the application developer's responsibility.
      if (
        inputValue === '' &&
        (props.inputValue === undefined || props.selectedKey === undefined)
      ) {
        setSelectedKey(null);
      }
    }

    // If it is the intial render and inputValue isn't controlled nor has an intial value, set input to match current selected key if any
    if (
      isInitialRender.current &&
      props.inputValue === undefined &&
      props.defaultInputValue === undefined
    ) {
      resetInputValue();
    }

    // If the selectedKey changed, update the input value.
    // Do nothing if both inputValue and selectedKey are controlled.
    // In this case, it's the user's responsibility to update inputValue in onSelectionChange.
    if (
      selectedKey !== lastSelectedKey.current &&
      (props.inputValue === undefined || props.selectedKey === undefined)
    ) {
      resetInputValue();
    } else {
      lastValue.current = inputValue;
    }

    // Update the inputValue if the selected item's text changes from its last tracked value.
    // This is to handle cases where a selectedKey is specified but the items aren't available (async loading) or the selected item's text value updates.
    // Only reset if the user isn't currently within the field so we don't erroneously modify user input.
    // If inputValue is controlled, it is the user's responsibility to update the inputValue when items change.
    let selectedItemText = collection.getItem(selectedKey)?.textValue ?? '';
    if (
      !isFocused &&
      selectedKey != null &&
      props.inputValue === undefined &&
      selectedKey === lastSelectedKey.current
    ) {
      if (lastSelectedKeyText.current !== selectedItemText) {
        lastValue.current = selectedItemText;
        setInputValue(selectedItemText);
      }
    }

    isInitialRender.current = false;
    lastSelectedKey.current = selectedKey;
    lastSelectedKeyText.current = selectedItemText;
  });

  // Revert input value and close menu
  let revert = () => {
    if (allowsCustomValue && selectedKey == null) {
      commitCustomValue();
    } else {
      commitSelection();
    }
  };

  let commitCustomValue = () => {
    lastSelectedKey.current = null;
    setSelectedKey(null);
  };

  let commitSelection = () => {
    // If multiple things are controlled, call onSelectionChange
    if (props.selectedKey !== undefined && props.inputValue !== undefined) {
      props.onSelectionChange(selectedKey);

      // Stop menu from reopening from useEffect
      let itemText = collection.getItem(selectedKey)?.textValue ?? '';
      lastValue.current = itemText;
    } else {
      // If only a single aspect of combobox is controlled, reset input value and close menu for the user
      resetInputValue();
    }
  };

  let commit = () => {
    if (selectionManager.focusedKey != null) {
      // Reset inputValue and close menu here if the selected key is already the focused key. Otherwise
      // fire onSelectionChange to allow the application to control the closing.
      if (selectedKey === selectionManager.focusedKey) {
        commitSelection();
      } else {
        setSelectedKey(selectionManager.focusedKey);
      }
    } else if (allowsCustomValue) {
      commitCustomValue();
    } else {
      // Reset inputValue and close menu if no item is focused but user triggers a commit
      commitSelection();
    }
  };

  let setFocused = (isFocused) => {
    if (isFocused) {
    } else if (shouldCloseOnBlur) {
      let itemText = collection.getItem(selectedKey)?.textValue ?? '';
      if (allowsCustomValue && inputValue !== itemText) {
        commitCustomValue();
      } else {
        commitSelection();
      }
    }

    setFocusedState(isFocused);
  };

  return {
    ...triggerState,
    toggle,
    open,
    selectionManager,
    selectedKey,
    setSelectedKey,
    disabledKeys,
    isFocused,
    setFocused,
    selectedItem,
    collection: showAllItems ? originalCollection : filteredCollection,
    inputValue,
    setInputValue,
    commit,
    revert,
  };
}

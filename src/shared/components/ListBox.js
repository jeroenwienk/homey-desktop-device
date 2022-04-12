import React, { useRef, createContext, useContext } from 'react';
import { useListState, Item, Section } from 'react-stately';
import {
  useListBox,
  useOption,
  useListBoxSection,
  useSeparator,
} from 'react-aria';
import { mergeRefs } from '../lib/mergeRefs';

export function renderCollectionItem(sourceItem) {
  return (
    <Item
      key={sourceItem.key}
      value={sourceItem}
      aria-label={sourceItem['aria-label']}
      textValue={sourceItem.textValue ?? '-'}
      children={sourceItem}
    />
  );
}

export function renderCollectionSection(sourceSection) {
  return (
    <Section
      key={sourceSection.key}
      title={sourceSection.title}
      aria-label={sourceSection['aria-label']}
      items={sourceSection.children}
    >
      {renderCollectionItem}
    </Section>
  );
}

export function ListBox(props) {
  const listBoxRef = useRef();

  const sharedProps = {
    id: props.id,
    items: props.items,
    children:
      props.renderSection != null
        ? renderCollectionSection
        : renderCollectionItem,
    label: props.label,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    autoFocus: props.autoFocus ?? false,
    shouldFocusWrap: true,
    selectedKeys: props.selectedKeys,
    defaultSelectedKeys: props.defaultSelectedKeys,
    disallowEmptySelection: props.disallowEmptySelection,
    disabledKeys: ['edit'],
    selectionMode: props.selectionMode ?? 'single',
    shouldFocusOnHover: props.shouldFocusOnHover ?? null,
    // needs to be true to implement drag and drop
    shouldSelectOnPressUp: props.shouldSelectOnPressUp ?? null,
    shouldUseVirtualFocus: props.shouldUseVirtualFocus ?? null,
    onSelectionChange(keys) {
      props.onSelectionChange([...keys], listState);
    },
  };

  // using the parent state local items and children are ignored
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const listState = props.state ?? useListState(sharedProps);
  const listBox = useListBox(sharedProps, listState, listBoxRef);

  // for now it's a problem
  // rendering any input inside the listbox can cause
  // the typeahead behavior to occur and focusing whatever textvalue matches
  // since it is a nice to have delete it and deal with it later
  // delete listBox.listBoxProps.onKeyDownCapture;
  const Wrapper = props.wrapper ?? React.Fragment;

  let mapper = null;

  if (props.renderSection == null) {
    mapper = (item) => {
      return (
        <ListBoxOption
          key={item.key}
          item={item}
          listState={listState}
          renderItem={props.renderItem}
        />
      );
    };
  } else {
    mapper = (item) => {
      return (
        <ListBoxSection
          key={item.key}
          item={item}
          listState={listState}
          renderSection={props.renderSection}
          renderItem={props.renderItem}
        />
      );
    };
  }

  return (
    <Wrapper>
      {sharedProps.label ? (
        props.renderLabel ? (
          props.renderLabel({
            label: sharedProps.label,
            props: listBox.labelProps,
          })
        ) : (
          <div {...listBox.labelProps}>{sharedProps.label}</div>
        )
      ) : null}
      <ul
        {...listBox.listBoxProps}
        ref={mergeRefs([listBoxRef, props.listBoxRef])}
        className={props.className}
        style={props.style}
      >
        {[...listState.collection].map(mapper)}
      </ul>
    </Wrapper>
  );
}

const SectionContext = createContext();

export function useSectionContext() {
  return useContext(SectionContext);
}

function ListBoxSection(props) {
  const section = useListBoxSection({
    heading: props.item.rendered,
    'aria-label': props.item['aria-label'],
  });

  const separator = useSeparator({
    elementType: 'li',
  });

  // If the section is not the first, add a separator element.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <SectionContext.Provider
      value={{
        section,
        item: props.item,
        state: props.listState,
        children: [...props.item.childNodes].map((node) => {
          return (
            <ListBoxOption
              key={node.key}
              item={node}
              listState={props.listState}
              renderItem={props.renderItem}
            />
          );
        }),
      }}
    >
      {props.item.key !== props.listState.collection.getFirstKey() && (
        <li {...separator.separatorProps} />
      )}

      {props.renderSection({
        item: props.item,
        state: props.listState,
      })}
    </SectionContext.Provider>
  );
}

const OptionContext = createContext();

export function useOptionContext() {
  return useContext(OptionContext);
}

function ListBoxOption(props) {
  const optionRef = useRef();
  const option = useOption(
    {
      key: props.item.key,
      'aria-label': props.item['aria-label'],
    },
    props.listState,
    optionRef
  );

  return (
    <OptionContext.Provider
      value={{
        ref: optionRef,
        option: option,
        item: props.item,
        state: props.listState,
      }}
    >
      {props.renderItem({
        item: props.item,
        state: props.listState,
      })}
    </OptionContext.Provider>
  );
}

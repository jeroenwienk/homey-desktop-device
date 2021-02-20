import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { useTextField } from 'react-aria';

import { vars } from '../../theme/GlobalStyles';
import { mergeRefs } from '../../lib/mergeRefs';

import { IconButton } from '../../components/common/IconButton';
import { SettingsIcon } from '../../components/common/IconMask';

export const InputEntry = forwardRef(function (props, forwardedRef) {
  const textFieldRef = useRef();
  const textField = useTextField(
    {
      id: props.input.id,
      name: props.input.id,
      type: props.input.type,
      defaultValue: props.defaultValue,
      label: props.input.name,
      onKeyUp(event) {
        if (event.key === 'Enter') {
          props.onSubmit(event);
          textFieldRef.current.value = '';
        }
      },
    },
    textFieldRef
  );

  function handleSettingsPress(event) {
    props.onContextMenu();
  }

  return (
    <sc.Container
      ref={mergeRefs([forwardedRef])}
      onContextMenu={props.onContextMenu}
    >
      <sc.Label {...textField.labelProps}>
        {props.input.name}
        <IconButton
          onPress={handleSettingsPress}
          size={vars.icon_size_small}
          iconComponent={SettingsIcon}
        />
      </sc.Label>
      <sc.Input {...textField.inputProps} ref={textFieldRef} />
    </sc.Container>
  );
});

const sc = {};

sc.Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
  border-radius: 10px;
  background-color: ${vars.color_background_button};
  box-shadow: ${vars.box_shadow_default};
  border: ${vars.border_button};
`;

sc.Label = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: ${vars.color_primary_text};
  font-weight: 500;
`;

sc.Input = styled.input`
  position: relative;
  display: block;
  width: 100%;
  height: 48px;
  padding: 8px;
  color: ${vars.color_primary_text};
  background-color: ${vars.color_background_input};
  border: 1px solid ${vars.color_background_input};
  border-radius: 3px;
`;

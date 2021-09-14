import React, { createContext, useContext, useRef } from 'react';

import { useRadioGroup, useRadio } from 'react-aria';
import { useRadioGroupState } from 'react-stately';

const RadioContext = createContext();

export function RadioGroup(props) {
  const state = useRadioGroupState(props);
  const radioGroup = useRadioGroup(props, state);

  const register = props.register?.({
    required: props.required,
  });

  return (
    <div {...radioGroup.radioGroupProps}>
      <span {...radioGroup.labelProps}>{props.label}</span>
      <RadioContext.Provider value={state}>
        {props.children}
      </RadioContext.Provider>
    </div>
  );
}

export function Radio(props) {
  const ref = useRef();
  const state = useContext(RadioContext);

  const input = useRadio(props, state, ref);

  return (
    <label style={{ display: 'block' }}>
      <input {...input.inputProps} ref={ref} />
      {props.children}
    </label>
  );
}

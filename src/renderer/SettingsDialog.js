import React, { useEffect } from 'react';
// import styled from 'styled-components';
// import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from './memoryHistory';
import { setSettings, useSettings } from './store/settingStore';

import { DialogBase } from '../shared/components/dialog/DialogBase';
import { DialogActions } from '../shared/components/dialog/DialogActions';
import { DialogContent } from '../shared/components/dialog/DialogContent';
import { DialogForm } from '../shared/components/dialog/DialogForm';
import { IconButton } from '../shared/components/IconButton';
import { CancelIcon } from '../shared/components/IconMask';
// import { TextField } from './components/form/TextField';
import { Button } from '../shared/components/Button';
import { Checkbox } from '../shared/components/form/Checkbox';
import { AcceleratorField } from '../shared/components/form/AcceleratorField';

export function SettingsDialog(props) {
  const formId = useId();

  function handleClose() {
    history.push('/');
  }

  return (
    <DialogBase onClose={handleClose} isOpen>
      <DialogContent>
        <DialogActions>
          <IconButton iconComponent={CancelIcon} onPress={handleClose}/>
        </DialogActions>

        <SettingsForm formId={formId} onSubmit={handleClose}/>
      </DialogContent>
    </DialogBase>
  );
}

function SettingsForm(props) {
  const { register, handleSubmit, errors, reset } = useForm();
  const settings = useSettings();

  useEffect(() => {
    reset(settings);
  }, [reset, settings]);

  const onSubmit = (data) => {
    setSettings({ ...data });
    props.onSubmit(data);
  };

  return (
    <DialogForm id={props.formId} key={props.editId}>
      {/*<Checkbox*/}
      {/*  label="Enable web app window"*/}
      {/*  name="webAppWindowEnabled"*/}
      {/*  defaultValue={true}*/}
      {/*  register={register}*/}
      {/*  error={errors.webAppWindowEnabled}*/}
      {/*/>*/}
      <Checkbox
        label="Enable overlay window"
        name="overlayWindowEnabled"
        defaultValue={true}
        register={register}
        error={errors.overlayWindowEnabled}
      />

      <AcceleratorField
        label="Shortcut"
        name="commanderShortcutAccelerator"
        defaultValue=""
        register={register}
        error={errors.accelerator}
      />

      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </DialogForm>
  );
}

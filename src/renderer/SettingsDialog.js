import React, { useEffect } from 'react';
// import styled from 'styled-components';
// import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from './memoryHistory';
import { setSettings, useSettings } from './store/settingStore';

import { DialogBase } from './components/dialog/DialogBase';
import { DialogActions } from './components/dialog/DialogActions';
import { DialogContent } from './components/dialog/DialogContent';
import { DialogForm } from './components/dialog/DialogForm';
import { IconButton } from './components/common/IconButton';
import { CancelIcon } from './components/common/IconMask';
// import { TextField } from './components/form/TextField';
import { Button } from './components/common/Button';
import { Checkbox } from './components/form/Checkbox';

export function SettingsDialog(props) {
  const formId = useId();

  function handleClose() {
    history.push('/');
  }

  return (
    <DialogBase onClose={handleClose} isOpen>
      <DialogContent>
        <DialogActions>
          <IconButton iconComponent={CancelIcon} onPress={handleClose} />
        </DialogActions>

        <SettingsForm formId={formId} onSubmit={handleClose} />
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
      <Checkbox
        label="Enable web app window"
        name="webAppWindowEnabled"
        defaultValue={true}
        register={register}
        error={errors.webAppWindowEnabled}
      />

      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </DialogForm>
  );
}

import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import {
  createButton,
  editButton,
  removeButton,
} from '../../store/buttonStore';

import { DialogBase } from '../../../shared/components/dialog/DialogBase';
import { DialogContent } from '../../../shared/components/dialog/DialogContent';
import { DialogActions } from '../../../shared/components/dialog/DialogActions';
import { DialogForm } from '../../../shared/components/dialog/DialogForm';
import { IconButton } from '../../../shared/components/IconButton';
import { CancelIcon, RemoveIcon } from '../../../shared/components/IconMask';
import { TextField } from '../../../shared/components/form/TextField';
import { Checkbox } from '../../../shared/components/form/Checkbox';
import { Button } from '../../../shared/components/Button';

export function ButtonDialog(props) {
  const formId = useId();
  const searchParams = new URLSearchParams(props.location.search);
  const editId = searchParams.get('id');

  function handleClose() {
    history.push('/');
  }

  return (
    <DialogBase onClose={handleClose} isOpen>
      <DialogContent>
        <DialogActions>
          {editId !== 'create' && (
            <IconButton
              iconComponent={RemoveIcon}
              onPress={() => {
                removeButton({ id: editId });
                handleClose();
              }}
            />
          )}

          <IconButton iconComponent={CancelIcon} onPress={handleClose} />
        </DialogActions>

        <ButtonForm
          formId={formId}
          editId={editId}
          buttonList={props.buttonList}
          onSubmit={handleClose}
        />
      </DialogContent>
    </DialogBase>
  );
}

function ButtonForm(props) {
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data) => {
    if (props.editId === 'create') {
      createButton({ id: uuid(), ...data });
      props.onSubmit(data);
      return;
    }

    editButton({ id: props.editId, ...data });
    props.onSubmit(data);
  };

  useEffect(() => {
    if (props.editId !== 'create') {
      const button = props.buttonList.find((button) => {
        return button.id === props.editId;
      });
      reset(button);
    }
  }, [reset, props.editId, props.buttonList]);

  return (
    <DialogForm id={props.formId} key={props.editId}>
      <TextField
        autoFocus
        label="Name"
        name="name"
        defaultValue=""
        required
        minLength={1}
        register={register}
        error={errors.name}
      />
      <TextField
        label="Description"
        name="description"
        defaultValue=""
        register={register}
        error={errors.description}
      />
      <Checkbox
        label="Tray"
        name="tray"
        defaultValue={false}
        register={register}
        error={errors.tray}
      />

      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </DialogForm>
  );
}

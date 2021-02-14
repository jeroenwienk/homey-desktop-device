import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import { createInput, editInput, removeInput } from '../../store/inputStore';

import { DialogBase } from '../../components/dialog/DialogBase';
import { DialogContent } from '../../components/dialog/DialogContent';
import { DialogActions } from '../../components/dialog/DialogActions';
import { DialogForm } from '../../components/dialog/DialogForm';
import { IconButton } from '../../components/common/IconButton';
import { CancelIcon, RemoveIcon } from '../../components/common/IconMask';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/common/Button';

export function InputDialog(props) {
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
                removeInput({ id: editId });
                handleClose();
              }}
            />
          )}

          <IconButton iconComponent={CancelIcon} onPress={handleClose} />
        </DialogActions>

        <DisplayForm
          formId={formId}
          editId={editId}
          inputList={props.inputList}
          onSubmit={handleClose}
        />
      </DialogContent>
    </DialogBase>
  );
}

function DisplayForm(props) {
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data) => {
    if (props.editId === 'create') {
      createInput({ id: uuid(), ...data });
      props.onSubmit(data);
      return;
    }

    editInput({ id: props.editId, ...data });
    props.onSubmit(data);
  };

  useEffect(() => {
    if (props.editId !== 'create') {
      const input = props.inputList.find((input) => {
        return input.id === props.editId;
      });
      reset(input);
    }
  }, [props.editId, props.inputList]);

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

      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </DialogForm>
  );
}

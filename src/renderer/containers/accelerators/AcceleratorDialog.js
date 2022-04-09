import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import {
  createAccelerator,
  editAccelerator,
  removeAccelerator,
} from '../../store/acceleratorStore';

import { DialogBase } from '../../components/dialog/DialogBase';
import { DialogContent } from '../../components/dialog/DialogContent';
import { DialogActions } from '../../components/dialog/DialogActions';
import { DialogForm } from '../../components/dialog/DialogForm';
import { IconButton } from '../../components/common/IconButton';
import { CancelIcon, RemoveIcon } from '../../components/common/IconMask';
import { AcceleratorField } from '../../components/form/AcceleratorField';
import { Button } from '../../components/common/Button';
import { TextField } from "../../components/form/TextField";

export function AcceleratorDialog(props) {
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
                removeAccelerator({ id: editId });
                handleClose();
              }}
            />
          )}

          <IconButton iconComponent={CancelIcon} onPress={handleClose} />
        </DialogActions>

        <AcceleratorForm
          formId={formId}
          editId={editId}
          acceleratorList={props.acceleratorList}
          onSubmit={handleClose}
        />
      </DialogContent>
    </DialogBase>
  );
}

function AcceleratorForm(props) {
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data) => {
    if (props.editId === 'create') {
      createAccelerator({ id: uuid(), ...data });
      props.onSubmit(data);
      return;
    }

    editAccelerator({ id: props.editId, ...data });
    props.onSubmit(data);
  };

  useEffect(() => {
    if (props.editId !== 'create') {
      const accelerator = props.acceleratorList.find((accelerator) => {
        return accelerator.id === props.editId;
      });

      reset(accelerator);
    }
  }, [reset, props.editId, props.acceleratorList]);

  return (
    <DialogForm id={props.formId} key={props.editId}>
      <AcceleratorField
        label="Shortcut"
        name="keys"
        defaultValue=""
        register={register}
        error={errors.accelerator}
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

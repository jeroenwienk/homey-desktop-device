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

import { DialogBase } from '../../../shared/components/dialog/DialogBase';
import { DialogContent } from '../../../shared/components/dialog/DialogContent';
import { DialogActions } from '../../../shared/components/dialog/DialogActions';
import { DialogForm } from '../../../shared/components/dialog/DialogForm';
import { IconButton } from '../../../shared/components/IconButton';
import { CancelIcon, RemoveIcon } from '../../../shared/components/IconMask';
import { AcceleratorField } from '../../../shared/components/form/AcceleratorField';
import { Button } from '../../../shared/components/Button';
import { TextField } from "../../../shared/components/form/TextField";

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

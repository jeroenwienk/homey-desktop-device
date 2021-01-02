import React, { useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import {
  createAccelerator,
  editAccelerator,
  removeAccelerator,
} from '../../store/acceleratorStore';

import { vars } from '../../theme/GlobalStyles';

import { DialogBase } from '../../components/common/DialogBase';
import { Cancel, Remove } from '../../components/common/IconButton';
import { AcceleratorField } from '../../components/AcceleratorField';
import { Button } from '../../components/common/Button';

export function AcceleratorDialog(props) {
  const formId = useId();
  const searchParams = new URLSearchParams(props.location.search);
  const editId = searchParams.get('id');

  function handleClose() {
    history.push('/');
  }

  return (
    <DialogBase onClose={handleClose} isOpen>
      <sc.dialogContent>
        <sc.actions>
          {editId !== 'create' && (
            <Remove
              onPress={() => {
                removeAccelerator({ id: editId });
                handleClose();
              }}
            />
          )}

          <Cancel onPress={handleClose} />
        </sc.actions>

        <AcceleratorForm
          formId={formId}
          editId={editId}
          accelerators={props.accelerators}
          onSubmit={handleClose}
        />
      </sc.dialogContent>
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
      const accelerator = props.accelerators.find((accelerator) => {
        return accelerator.id === props.editId;
      });

      reset(accelerator);
    }
  }, [props.editId, props.accelerators]);

  return (
    <sc.editForm id={props.formId} key={props.editId}>
      <AcceleratorField
        label="Shortcut"
        name="keys"
        defaultValue=""
        register={register}
        error={errors.accelerator}
      />

      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </sc.editForm>
  );
}

const sc = {
  dialogContent: styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    background-color: ${vars.color_background_dialog};
    border-radius: 3px;
    box-shadow: ${vars.box_shadow_dialog};
  `,
  actions: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  `,
  editForm: styled.div`
    display: flex;
    flex-direction: column;
    min-width: 512px;
    gap: 16px;
  `,
};

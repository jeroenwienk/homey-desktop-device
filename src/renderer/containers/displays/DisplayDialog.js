import React, { useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import {
  createDisplay,
  editDisplay,
  removeDisplay,
} from '../../store/displayStore';

import { vars } from '../../theme/GlobalStyles';

import { DialogBase } from '../../components/common/DialogBase';
import { Cancel, Remove } from '../../components/common/IconButton';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/common/Button';

export function DisplayDialog(props) {
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
                removeDisplay({ id: editId });
                handleClose();
              }}
            />
          )}

          <Cancel onPress={handleClose} />
        </sc.actions>

        <DisplayForm
          formId={formId}
          editId={editId}
          displayList={props.displayList}
          onSubmit={handleClose}
        />
      </sc.dialogContent>
    </DialogBase>
  );
}

function DisplayForm(props) {
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data) => {
    if (props.editId === 'create') {
      createDisplay({ id: uuid(), ...data });
      props.onSubmit(data);
      return;
    }

    editDisplay({ id: props.editId, ...data });
    props.onSubmit(data);
  };

  useEffect(() => {
    if (props.editId !== 'create') {
      const display = props.displayList.find((display) => {
        return display.id === props.editId;
      });
      reset(display);
    }
  }, [props.editId, props.displayList]);

  return (
    <sc.editForm id={props.formId} key={props.editId}>
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
  editForm: styled.form`
    display: flex;
    flex-direction: column;
    min-width: 512px;
    gap: 16px;
  `,
};

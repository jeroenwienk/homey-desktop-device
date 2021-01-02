import React, { useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { useForm } from 'react-hook-form';
import { useId } from 'react-aria';

import { history } from '../../memoryHistory';
import {
  createButton,
  editButton,
  removeButton,
} from '../../store/buttonStore';

import { vars } from '../../theme/GlobalStyles';

import { DialogBase } from '../../components/common/DialogBase';
import { Cancel, Remove } from '../../components/common/IconButton';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/common/Button';

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
        <Actions>
          {editId !== 'create' && (
            <Remove
              onPress={() => {
                removeButton({ id: editId });
                handleClose();
              }}
            />
          )}

          <Cancel onPress={handleClose} />
        </Actions>

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
  }, [props.editId, props.buttonList]);

  return (
    <EditForm id={props.formId} key={props.editId}>
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
    </EditForm>
  );
}

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  background-color: ${vars.color_background_dialog};
  border-radius: 3px;
  box-shadow: ${vars.box_shadow_dialog};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 512px;
  gap: 16px;
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { ipcRenderer } from 'electron';

import { useForm } from 'react-hook-form';
import { useId } from '@react-aria/utils';

import { buttonStore, pushButton } from '../store/buttonStore';

import {
  AddIconButton,
  SaveIconButton,
  CancelIconButton,
} from '../components/common/IconButton';
import { Button } from '../components/actions/Button';
import { Heading } from '../components/Heading';
import { TextField } from '../components/TextField';

import { REND } from '../../shared/events';

export function Buttons() {
  const buttons = buttonStore((state) => state.buttons);
  const [editId, setEditId] = useState(null);

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    pushButton({ id: editId, ...data });
    setEditId(null);
  };

  const formId = useId();

  return (
    <Container>
      <EditSection>
        <ActionsContainer>
          {editId == null && (
            <AddIconButton onClick={() => setEditId(uuid())} />
          )}
          {editId != null && (
            <>
              <SaveIconButton type="submit" form={formId} />
              <CancelIconButton onClick={() => setEditId(null)} />
            </>
          )}
        </ActionsContainer>

        {editId != null && (
          <EditForm id={formId} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Button Name"
              name="name"
              defaultValue=""
              required
              minLength={1}
              register={register}
              error={errors.name}
            />
            <TextField
              label="Button Description"
              name="description"
              required
              defaultValue=""
              minLength={1}
              register={register}
              autoFocus
              error={errors.description}
            />
          </EditForm>
        )}
      </EditSection>

      <ButtonSection>
        <Heading>Buttons</Heading>
        <ButtonList>
          {buttons.map((button) => {
            return (
              <Button
                key={button.id}
                button={button}
                onPress={(event) => {
                  ipcRenderer.send(REND.BUTTON_RUN, { id: event.target.id });
                }}
              />
            );
          })}
        </ButtonList>
      </ButtonSection>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditForm = styled.form`
  margin-top: 8px;
`;

const ButtonSection = styled.div`
  flex: 1 1 auto;
`;

const ButtonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 16px 0 0;
`;

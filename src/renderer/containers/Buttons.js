import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { ipcRenderer } from 'electron';

import { useForm } from 'react-hook-form';
import { useId } from '@react-aria/utils';

import { buttonStore, pushButton, editButton } from '../store/buttonStore';

import {
  AddIconButton,
  SaveIconButton,
  CancelIconButton,
} from '../components/common/IconButton';
import { ButtonEntry } from '../components/actions/ButtonEntry';
import { Heading } from '../components/Heading';
import { TextField } from '../components/TextField';

import { REND } from '../../shared/events';

export function Buttons() {
  const buttons = buttonStore((state) => state.buttons);
  const broken = buttonStore((state) => state.broken);
  const [editId, setEditId] = useState(null);
  const [editButtonEntry, setEditButtonEntry] = useState(null);

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    if (editButton != null) {
      editButton({ id: editId, ...data });
      setEditId(null);
      setEditButtonEntry(null);
      return;
    }

    pushButton({ id: editId, ...data });
    setEditId(null);
    setEditButtonEntry(null);
  };

  const formId = useId();

  return (
    <>
      <Container>
        <EditSection>
          <ActionsContainer>
            {editId == null && (
              <AddIconButton onClick={() => setEditId(uuid())} />
            )}
            {editId != null && (
              <>
                <SaveIconButton type="submit" form={formId} />
                <CancelIconButton
                  onClick={() => {
                    setEditId(null);
                    setEditButtonEntry(null);
                  }}
                />
              </>
            )}
          </ActionsContainer>

          {editId != null && (
            <EditForm
              id={formId}
              key={editId}
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                label="Name"
                name="name"
                defaultValue={editButtonEntry?.name ?? ''}
                required
                minLength={1}
                register={register}
                error={errors.name}
              />
              <TextField
                label="Description"
                name="description"
                required
                defaultValue={editButtonEntry?.description ?? ''}
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
                <ButtonEntry
                  key={button.id}
                  id={button.id}
                  button={button}
                  onPress={(event) => {
                    ipcRenderer.send(REND.BUTTON_RUN, { id: event.target.id });
                  }}
                  onContextMenu={(event) => {
                    const id = event.currentTarget.id;
                    setEditId(id);
                    setEditButtonEntry(
                      buttons.find((button) => button.id === id)
                    );
                  }}
                />
              );
            })}
          </ButtonList>
        </ButtonSection>
      </Container>
      {broken.map((brokenEntry) => {
        if (brokenEntry.flow && brokenEntry.button) {
          return (
            <div key={brokenEntry.flow.id}>
              <div>{brokenEntry.flow.name}</div>
              <div>{brokenEntry.button.name}</div>
            </div>
          );
        }

        return null;
      })}
    </>
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

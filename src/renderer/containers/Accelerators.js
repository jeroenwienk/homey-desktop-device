import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { ipcRenderer } from 'electron';

import { useForm } from 'react-hook-form';
import { useId } from '@react-aria/utils';

import { REND } from '../../shared/events';
import {
  pushAccelerator,
  editAccelerator,
  removeAccelerator,
  acceleratorStore,
} from '../store/acceleratorStore';

import {
  AddIconButton,
  SaveIconButton,
  CancelIconButton,
  RemoveIconButton,
} from '../components/common/IconButton';
import { AcceleratorField } from '../components/AcceleratorField';
import { AcceleratorEntry } from '../components/actions/AcceleratorEntry';
import { Heading } from '../components/Heading';

export function Accelerators() {
  const accelerators = acceleratorStore((state) => state.accelerators);
  const broken = acceleratorStore((state) => state.broken);
  const [editId, setEditId] = useState(null);
  const [editAcceleratorEntry, setEditAcceleratorEntry] = useState(null);

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    if (editAcceleratorEntry != null) {
      editAccelerator({ id: editId, keys: data.accelerator });
      setEditId(null);
      setEditAcceleratorEntry(null);
      return;
    }

    pushAccelerator({ id: editId, keys: data.accelerator });
    setEditId(null);
    setEditAcceleratorEntry(null);
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

              {editAcceleratorEntry && (
                <RemoveIconButton
                  onClick={() => {
                    removeAccelerator(editAcceleratorEntry);
                    setEditId(null);
                    setEditAcceleratorEntry(null);
                  }}
                />
              )}

              <CancelIconButton
                onClick={() => {
                  setEditId(null);
                  setEditAcceleratorEntry(null);
                }}
              />
            </>
          )}
        </ActionsContainer>

        {editId != null && (
          <EditForm id={formId} key={editId} onSubmit={handleSubmit(onSubmit)}>
            <AcceleratorField
              label="Accelerator"
              name="accelerator"
              defaultValue={editAcceleratorEntry?.keys ?? ''}
              register={register}
              error={errors.accelerator}
            />
          </EditForm>
        )}
      </EditSection>

      <AcceleratorSection>
        <Heading>Accelerators</Heading>
        <AcceleratorList>
          {accelerators.map((accelerator) => {
            return (
              <AcceleratorEntry
                key={accelerator.id}
                id={accelerator.id}
                accelerator={accelerator}
                onPress={(event) => {
                  ipcRenderer.send(REND.ACCELERATOR_RUN, {
                    id: event.target.id,
                  });
                }}
                onContextMenu={(event) => {
                  const id = event.currentTarget.id;
                  setEditId(id);
                  setEditAcceleratorEntry(
                    accelerators.find((accelerator) => accelerator.id === id)
                  );
                }}
              />
            );
          })}
        </AcceleratorList>
      </AcceleratorSection>
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

const AcceleratorSection = styled.div`
  flex: 1 1 auto;
`;

const AcceleratorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 16px 0 0;
`;

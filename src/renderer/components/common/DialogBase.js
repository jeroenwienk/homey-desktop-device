import React, { useRef } from 'react';
import styled from 'styled-components';

import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
} from '@react-aria/overlays';

import { FocusScope } from '@react-aria/focus';
import { useDialog } from '@react-aria/dialog';

import { VAR, VARIABLES } from '../../theme/GlobalStyles';

export function DialogBase(props) {
  const overlayRef = useRef();
  const overlay = useOverlay(
    {
      onClose: props.onClose,
      isOpen: props.isOpen,
      isDismissable: true,
    },
    overlayRef
  );

  usePreventScroll();

  const modal = useModal();
  const dialog = useDialog(
    {
      role: props.role ?? 'dialog',
      'aria-label': props['aria-label'] ?? 'Dialog',
    },
    overlayRef
  );

  return (
    <OverlayContainer>
      <Overlay>
        <FocusScope contain restoreFocus autoFocus>
          <ContentContainer
            {...overlay.overlayProps}
            {...dialog.dialogProps}
            {...modal.modalProps}
            ref={overlayRef}
          >
            {props.children}
          </ContentContainer>
        </FocusScope>
      </Overlay>
    </OverlayContainer>
  );
}

const Overlay = styled.div`
  display: flex;
  position: fixed;
  z-index: ${VAR(VARIABLES.Z_INDEX_OVERLAY)};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background: ${VAR(VARIABLES.COLOR_BACKGROUND_OVERLAY)};
`;

const ContentContainer = styled.div`
  outline: 0;
`;

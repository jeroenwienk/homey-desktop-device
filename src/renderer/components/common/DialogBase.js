import React, { useRef } from 'react';
import styled from 'styled-components';

import {
  useOverlay,
  usePreventScroll,
  useModal,
  useDialog,
  FocusScope,
  OverlayContainer,
} from 'react-aria';

import { vars } from '../../theme/GlobalStyles';

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
      <sc.overlay>
        <FocusScope contain restoreFocus autoFocus>
          <sc.contentContainer
            {...overlay.overlayProps}
            {...dialog.dialogProps}
            {...modal.modalProps}
            ref={overlayRef}
          >
            {props.children}
          </sc.contentContainer>
        </FocusScope>
      </sc.overlay>
    </OverlayContainer>
  );
}

const sc = {
  overlay: styled.div`
    display: flex;
    position: fixed;
    z-index: ${vars.z_index_overlay};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    background: ${vars.color_background_overlay};
  `,
  contentContainer: styled.div`
    outline: 0;
  `,
};

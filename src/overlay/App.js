import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useHover } from 'react-aria';

import { OVERLAY } from '../shared/events';
import { displayStore } from './overlay';

import { vars } from '../renderer/theme/GlobalStyles';

import { IconButton } from '../renderer/components/common/IconButton';
import { DragIcon, SettingsIcon } from '../renderer/components/common/IconMask';

export function App() {
  const texts = displayStore((state) => state.texts);
  const displays = displayStore((state) => state.displays);

  useEffect(() => {
    ipcRenderer.send(OVERLAY.INIT, {});
  }, []);

  const hover = useHover({});

  return (
    <sc.container isHovered={true}>
      <sc.topBar>
        <sc.dragHandleWrapper {...hover.hoverProps}>
          <sc.dragHandle />
        </sc.dragHandleWrapper>

        <IconButton
          iconComponent={SettingsIcon}
          size={vars.icon_size_default}
        />
      </sc.topBar>

      {displays.map((display) => {
        return (
          <sc.displayContainer key={display.id}>
            <sc.name>{display.name}</sc.name>
            <sc.text>
              {texts[display.id] != null ? texts[display.id] : display.text}
            </sc.text>
          </sc.displayContainer>
        );
      })}
    </sc.container>
  );
}

const sc = {
  container: styled.div`
    width: 100vw;
    height: 100vh;
    padding: 10px;
    background-color: ${(props) =>
      props.isHovered ? vars.color_background_app : 'transparent'};
  `,
  displayContainer: styled.div``,
  name: styled.div`
    display: inline-block;
    color: ${vars.color_primary_text_accent};
    font-size: 24px;
    margin-right: 8px;
  `,
  text: styled.div`
    display: inline-block;
    font-size: 24px;
  `,
  topBar: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  dragHandleWrapper: styled.div``,
  dragHandle: styled(DragIcon)`
    -webkit-app-region: drag;
  `,
};

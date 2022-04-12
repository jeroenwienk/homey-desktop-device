import styled from 'styled-components';

import { vars } from '../theme/GlobalStyles';

export const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  color: ${(props) =>
    props.isFocusVisible
      ? vars.color_primary_text
      : vars.color_primary_text_accent};
  font-weight: 700;
  line-height: 22px;

  &:hover:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    background-color: ${vars.color_hover};
  }

  &:active:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    background-color: ${vars.color_active};
  }
`;

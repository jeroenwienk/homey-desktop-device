import styled from 'styled-components';

import { VARIABLES, VAR } from '../../theme/GlobalStyles';

export const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  color: ${(props) =>
    props.isFocusVisible
      ? VAR(VARIABLES.COLOR_PRIMARY_TEXT)
      : VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)};
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
    background-color: ${VAR(VARIABLES.COLOR_HOVER)};
  }

  &:active:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    background-color: ${VAR(VARIABLES.COLOR_ACTIVE)};
  }
`;

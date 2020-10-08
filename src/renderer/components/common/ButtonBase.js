import styled from 'styled-components';

import { VARIABLES, VAR } from '../../theme/GlobalStyles';

export const ButtonBase = styled.button`
  display: inline-flex;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT)};
  line-height: 12px;

  &:hover:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    background-color: ${VAR(VARIABLES.COLOR_HOVER)};
  }

  &:active:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    background-color: ${VAR(VARIABLES.COLOR_ACTIVE)};
  }
`;

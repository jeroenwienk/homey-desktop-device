import styled from 'styled-components';

import { VAR, VARIABLES } from '../../theme/GlobalStyles';

export const Heading = styled.h3`
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
  margin: 0;
  padding: 0;
  color: ${VAR(VARIABLES.COLOR_PRIMARY_TEXT_ACCENT)};
`;

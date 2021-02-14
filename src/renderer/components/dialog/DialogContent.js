import styled from 'styled-components';
import { vars } from '../../theme/GlobalStyles';

export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  background-color: ${vars.color_background_dialog};
  border-radius: 3px;
  box-shadow: ${vars.box_shadow_dialog};
`;
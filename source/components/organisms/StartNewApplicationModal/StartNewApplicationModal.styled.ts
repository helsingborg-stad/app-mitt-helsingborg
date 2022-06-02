import styled from "styled-components/native";

import { ThemeType } from "../../../styles/themeHelpers";

interface DialogContainerProps {
  theme: ThemeType;
}

const DialogContainer = styled.View<DialogContainerProps>`
  width: 80%;
  background: ${({ theme }) => theme.colors.neutrals[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 0px 16px 16px 16px;
`;

const CancelButton = styled.TouchableOpacity`
  color: black;
`;

export { DialogContainer, CancelButton };

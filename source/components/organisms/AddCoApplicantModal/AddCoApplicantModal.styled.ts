import styled from "styled-components/native";

import { ThemeType } from "../../../styles/themeHelpers";

import { Text } from "../../atoms";

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

interface ContainerProps {
  border?: boolean;
}
const Container = styled.View<ContainerProps>`
  padding: 22px 8px;
  width: 100%;

  ${({ border }) =>
    border &&
    `
    border-bottom-width: 1px;
    border-bottom-color: grey;
  `}
`;

const InputLabel = styled(Text)`
  padding: 12px 0px 4px 0px;
`;

const ErrorText = styled(Text)`
  padding-top: 20px;
  color: ${({ theme }: { theme: ThemeType }) => theme.colors.primary.red[1]};
`;

export { DialogContainer, Container, InputLabel, ErrorText };

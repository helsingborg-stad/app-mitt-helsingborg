import styled from "styled-components/native";

import { Button } from "../../atoms";

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

const StyledButton = styled(Button)`
  margin-top: 8px;
`;

export { Container, StyledButton };

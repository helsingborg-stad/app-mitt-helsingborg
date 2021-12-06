import styled from "styled-components/native";

import { Button } from "../../atoms";

const ButtonListContainer = styled.View`
  padding: 20px 20px 40px 20px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 16px;
`;

const Underline = styled.View`
  margin-bottom: 15px;
  margin-top: 3px;
  margin-left: 5px;
  margin-right: 5px;
  height: 2px;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

export { ButtonListContainer, StyledButton, Underline };

import styled from "styled-components/native";

import Text from "../Text";

const Wrapper = styled.View`
  margin-bottom: 30px;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

export { Wrapper, StyledErrorText };

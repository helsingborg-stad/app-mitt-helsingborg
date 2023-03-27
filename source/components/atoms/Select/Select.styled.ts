import styled from "styled-components/native";

import Text from "../Text";

const Wrapper = styled.View`
  margin-bottom: 30px;
`;

const InputRowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const InputRowTextWrapper = styled.View`
  flex-grow: 1;
`;

const InputRowIconWrapper = styled.View`
  margin-left: 5px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

export {
  Wrapper,
  InputRowWrapper,
  InputRowTextWrapper,
  InputRowIconWrapper,
  StyledErrorText,
};

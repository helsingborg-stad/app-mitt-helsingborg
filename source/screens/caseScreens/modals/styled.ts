import styled from "styled-components/native";

import Button from "../../../components/atoms/Button";
import Text from "../../../components/atoms/Text";

import Body from "../../../components/molecules/Dialog/Body";

export const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const DialogContainer = styled(Body)`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 25px;
  width: 100%;
`;

export const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 12px;
`;

export const StyledText = styled(Text)`
  margin-bottom: 8px;
`;

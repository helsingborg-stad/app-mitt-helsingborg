import styled from "styled-components/native";

import { Button, Text } from "../../../components/atoms";
import { getScreenHeightProportion } from "../../../helpers/Misc";

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ScreenContainer = styled.View`
  height: ${getScreenHeightProportion(80)}px;
  padding: 0px 10px 110px 10px;
`;

const ConfirmDialogButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding: 20px 14px 0px 14px;
  justify-content: space-evenly;
  width: 100%;
`;

const ButtonText = styled(Text)<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  color: ${({ color }) => color};
`;

const ModalTextContainer = styled.View`
  padding: 0 24px;
  text-align: center;
`;

interface StyledButtonType {
  background?: string;
}
const StyledButton = styled(Button)<StyledButtonType>`
  height: 40px;
  width: 110px;
  justify-content: center;
  ${({ background }) =>
    background ? `background-color: ${background};` : null}
`;

export {
  SpinnerContainer,
  ScreenContainer,
  ConfirmDialogButtonContainer,
  ModalTextContainer,
  ButtonText,
  StyledButton,
};

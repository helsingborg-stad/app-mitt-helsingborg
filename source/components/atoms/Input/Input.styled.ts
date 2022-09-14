import { Dimensions } from "react-native";
import styled from "styled-components/native";

import Text from "../Text";

import type { ErrorValidation } from "./Input.types";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";

const InputContainer = styled.View`
  width: 100%;
`;

interface StyledInputprops {
  theme: ThemeType;
  colorSchema: PrimaryColor;
  center: boolean;
  hidden: boolean;
  transparent: boolean;
  error: ErrorValidation;
}
const StyledTextInput = styled.TextInput<StyledInputprops>`
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  background-color: ${({ theme, colorSchema }) =>
    theme.colors.complementary[colorSchema][2]};
  ${({ transparent }) => transparent && `background-color: transparent;`}
  border-radius: 4.5px;
  border: solid 1px
    ${({ theme, error }) =>
      error?.isValid || error === undefined
        ? "transparent"
        : theme.colors.primary.red[0]};
  padding: 16px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
  ${({ center }) => (center ? "text-align: center;" : null)}
  ${({ hidden }) => (hidden ? "display: none;" : null)}
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

const AccesoryViewChild = styled.View`
  width: ${Dimensions.get("window").width}px;
  height: 48px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: #f8f8f8;
  padding-right: 16px;
`;

export { InputContainer, StyledTextInput, StyledErrorText, AccesoryViewChild };

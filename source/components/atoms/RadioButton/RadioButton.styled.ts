import styled from "styled-components/native";

import SHADOW from "../../../theme/shadow";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";
import type { Size } from "./RadioButton.types";

const TouchableArea = styled.TouchableHighlight<{
  size: Size;
  theme: ThemeType;
}>`
  height: ${({ theme, size }) => theme.radiobutton[size].touchable.height}px;
  width: ${({ theme, size }) => theme.radiobutton[size].touchable.width}px;
  border-radius: ${({ theme, size }) =>
    theme.radiobutton[size].touchable.borderRadius}px;
`;

const RadioButtonBorder = styled.View<{
  colorSchema: PrimaryColor;
  z: 0 | 1 | 2 | 3 | 4;
  size: Size;
  theme: ThemeType;
}>`
  align-items: center;
  justify-content: center;
  border-color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
  shadow-color: ${(props) => props.theme.button[props.colorSchema].shadow};
  height: ${({ theme, size }) => theme.radiobutton[size].border.height}px;
  width: ${({ theme, size }) => theme.radiobutton[size].border.width}px;
  border-radius: ${({ theme, size }) =>
    theme.radiobutton[size].border.borderRadius}px;
  border-width: ${({ theme, size }) =>
    theme.radiobutton[size].border.borderWidth}px;
  margin: 0;
  padding: 0;
  ${(props) => SHADOW[props.z]}
`;

const RadioButtonFill = styled.View<{
  colorSchema: PrimaryColor;
  size: Size;
  theme: ThemeType;
}>`
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.primary[props.colorSchema][1]};
  height: ${({ theme, size }) => theme.radiobutton[size].fill.height}px;
  width: ${({ theme, size }) => theme.radiobutton[size].fill.width}px;
  border-radius: ${({ theme, size }) =>
    theme.radiobutton[size].fill.borderRadius}px;
  margin: ${({ theme, size }) => theme.radiobutton[size].fill.margin}px;
`;

export { TouchableArea, RadioButtonBorder, RadioButtonFill };

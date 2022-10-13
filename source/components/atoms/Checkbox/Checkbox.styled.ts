import styled from "styled-components/native";

import Icon from "../Icon";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";
import type { Size } from "./Checkbox.types";

interface BoxProps {
  checked: boolean;
  colorSchema: PrimaryColor;
  backgroundColor: string;
  size: Size;
  theme: ThemeType;
}
const CheckboxBox = styled.TouchableHighlight<BoxProps>`
  border-style: solid;
  border-color: ${(props) =>
    props.checked
      ? "transparent"
      : props.theme.colors.complementary[props.colorSchema][0]};
  background-color: ${({ checked, backgroundColor }) =>
    checked ? backgroundColor : "transparent"};
  width: ${(props) => props.theme.checkbox[props.size].width}px;
  height: ${(props) => props.theme.checkbox[props.size].height}px;
  padding: ${(props) => props.theme.checkbox[props.size].padding}px;
  margin: ${(props) => props.theme.checkbox[props.size].margin}px;
  border-width: ${(props) => props.theme.checkbox[props.size].borderWidth}px;
  border-radius: ${(props) => props.theme.checkbox[props.size].borderRadius}px;
`;

interface CheckboxProps {
  color: string;
}
const CheckboxTick = styled(Icon)<CheckboxProps>`
  color: ${({ color }) => color};
  margin-left: -2px;
  margin-top: -3px;
`;

export { CheckboxBox, CheckboxTick };

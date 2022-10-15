import styled from "styled-components/native";

import Text from "../Text";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";
import type { Size } from "./Label.types";

const LabelText = styled(Text)<{
  size: Size;
  color: PrimaryColor;
  theme: ThemeType;
}>`
  font-size: ${({ theme, size }) => theme.label[size].font}px;
  color: ${({ theme, color }) => theme.label.colors[color].text};
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 8px;
  padding-top: 4px;
`;

const LabelBorder = styled.View<{
  size: Size;
  color: PrimaryColor;
  underline?: boolean;
  theme: ThemeType;
}>`
  padding-bottom: ${({ underline, theme, size }) => {
    if (underline === false) return 0;
    return theme.label[size].paddingBottom;
  }}px;
  border-bottom-color: ${({ theme, color }) =>
    theme.label.colors[color].underline};
  border-bottom-width: ${({ underline, theme, size }) => {
    if (underline === false) {
      return 0;
    }
    return theme.label[size].lineWidth;
  }}px;
  margin-bottom: ${({ underline, theme, size }) => {
    if (underline === false) {
      return 0;
    }
    return theme.label[size].marginBottom;
  }}px;
  align-self: flex-start;
  margin-right: 8px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  padding-right: 10px;
  justify-content: center;
`;

const LabelWrapper = styled.View`
  flex: auto;
`;

const HelpWrapper = styled.View`
  flex: auto;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 22px;
`;

export { LabelText, LabelBorder, LabelContainer, LabelWrapper, HelpWrapper };

import styled from "styled-components/native";
import type { ThemeType } from "../../../styles/themeHelpers";

import type { StyledProps } from "./types";

const ButtonContainer = styled.TouchableHighlight<StyledProps>`
  padding: 12px 20px;
  width: ${({ buttonWidth }) => buttonWidth};
  height: 54px;
  background: ${({ theme, colorSchema }) =>
    colorSchema === "red"
      ? theme.colors.primary.red[0]
      : theme.colors.neutrals[5]};
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  display: flex;
  flex-direction: row;
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: center;
  position: absolute;
  bottom: 10px;
  top: auto;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 10;
  z-index: 10;
  ${({ position }) => {
    if (position === "center") {
      return `
        margin-left: 5%;
        margin-right: 5%;
      `;
    }
    if (position === "left") {
      return `
        left: 10px;
        right: auto;
      `;
    }
    return `
      right: 10px;
      left: auto;
    `;
  }}
`;

interface ButtonTextProps {
  theme: ThemeType;
  colorSchema: "red" | "neutral";
}
const ButtonText = styled.Text<ButtonTextProps>`
  color: ${({ theme, colorSchema }) =>
    colorSchema === "red"
      ? theme.colors.neutrals[7]
      : theme.colors.neutrals[0]};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 0;
  margin: 0;
`;

export { ButtonContainer, ButtonText };

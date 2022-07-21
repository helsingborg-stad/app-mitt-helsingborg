import styled from "styled-components/native";
import type { ThemeType, PrimaryColor } from "../../../styles/themeHelpers";

export const Container = styled.View<{ theme: ThemeType }>`
  margin: ${(props) => props.theme.sizes[0]}px;
  flex: 1;
`;

export const UploaderLabel = styled.Text<{
  theme: ThemeType;
  colorSchema: PrimaryColor;
}>`
  font-weight: 500;
  margin: 0;
  font-size: 16px;
  color: ${({ theme, colorSchema }) => theme.colors.primary[colorSchema][1]};
`;

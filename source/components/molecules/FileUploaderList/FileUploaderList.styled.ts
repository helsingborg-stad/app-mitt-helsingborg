import styled from "styled-components/native";
import type { ThemeType, PrimaryColor } from "../../../theme/themeHelpers";

export const Container = styled.View<{ theme: ThemeType }>`
  margin: ${(props) => props.theme.sizes[0]}px;
  flex: 1;
  border-radius: 5px;
  background: #eee;
  padding: 0px 16px;
`;

export const UploaderLabelContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 0px 16px;
`;

export const UploaderLabel = styled.Text<{
  theme: ThemeType;
  colorSchema: PrimaryColor;
}>`
  font-weight: 700;
  margin: 0;
  font-size: 16px;
  color: ${({ theme, colorSchema }) => theme.colors.primary[colorSchema][1]};
`;

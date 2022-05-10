import styled from "styled-components/native";
import { getValidColorSchema } from "../../../styles/theme";
import { ThemeType, PrimaryColor } from "../../../styles/themeHelpers";

export const Container = styled.View<{ theme: ThemeType }>`
  margin: ${(props) => props.theme.sizes[0]}px;
`;

export const UploaderLabel = styled.Text<{
  theme: ThemeType;
  colorSchema: string;
}>`
  font-weight: 500;
  margin: 0;
  color: black;
  font-size: 16px;
  color: ${({ theme, colorSchema }) =>
    theme.colors.primary[getValidColorSchema(colorSchema) as PrimaryColor][1]};
`;

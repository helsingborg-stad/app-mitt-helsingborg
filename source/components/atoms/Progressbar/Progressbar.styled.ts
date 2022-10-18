import styled from "styled-components/native";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";

const ProgressbarBox = styled.View<{
  percentage: number;
  rounded: boolean;
  colorSchema: PrimaryColor;
  theme: ThemeType;
}>`
  ${({ rounded }) => rounded && `border-radius: 50px;`}
  height: 100%;
  background-color: ${({ colorSchema, theme }) =>
    colorSchema === "neutral"
      ? theme.colors.neutrals[2]
      : theme.colors.primary[colorSchema][3]};
  opacity: 2;
  width: ${(props) => props.percentage}%;
`;

const ProgressbarBackground = styled.View<{
  rounded: boolean;
  colorSchema: PrimaryColor;
  theme: ThemeType;
}>`
  ${({ rounded }) => rounded && `border-radius: 50px;`}
  background-color: ${({ colorSchema, theme }) =>
    colorSchema === "neutral"
      ? `${theme.colors.neutrals[0]}1F`
      : theme.colors.complementary[colorSchema][3]};
  height: 3px;
  width: 100%;
`;

export { ProgressbarBox, ProgressbarBackground };

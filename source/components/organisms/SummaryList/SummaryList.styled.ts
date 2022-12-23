import styled from "styled-components/native";

import { Text, Heading } from "../../atoms";

import type { PrimaryColor, ThemeType } from "../../../theme/themeHelpers";

interface SumLabelProps {
  colorSchema: PrimaryColor;
}
const SumLabel = styled(Heading)<SumLabelProps>`
  margin-top: 5px;
  margin-left: 3px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme, colorSchema }) => theme.colors.primary[colorSchema][1]};
`;

const SumText = styled(Text)`
  margin-left: 4px;
  margin-top: 10px;
`;

// TODO: the sum component should be sent as a footer to the grouped list, at which point this container should be removed.
// Currently it's using a negative margin, which is a hack and only meant as a temporary fix.
interface SumContainerProps {
  colorSchema: PrimaryColor;
  theme: ThemeType;
}
const SumContainer = styled.View<SumContainerProps>`
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 24px;
  margin-top: -64px;
  padding: 16px 16px 20px 16px;
  background: ${({ theme, colorSchema }) =>
    theme.colors.complementary[colorSchema][3]};
`;

interface SummarySpacerProps {
  colorSchema: PrimaryColor;
  theme: ThemeType;
}
const SummarySpacer = styled.View<SummarySpacerProps>`
  margin-bottom: 16px;
  height: 4px;
  width: 32px;
  background: ${({ theme, colorSchema }) =>
    theme.label.colors[colorSchema].underline};
`;

export { SumLabel, SumText, SumContainer, SummarySpacer };

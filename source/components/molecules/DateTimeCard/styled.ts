import styled from "styled-components/native";
import type { ThemeType } from "../../../theme/themeHelpers";

const Container = styled.View<{ align: string; theme: ThemeType }>`
  margin-top: 10px;
  border-width: 3px;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ align }) => align};
  ${({ theme }) => `background-color: ${theme.colors.complementary.red[3]};`}
  ${({ theme }) => `border-color: ${theme.colors.complementary.red[2]};`}
`;

const TitleText = styled.Text<{ size: "large" | "small"; theme: ThemeType }>`
  font-size: ${({ size, theme }) =>
    size === "large" ? theme.fontSizes[2] : theme.fontSizes[1]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  ${({ theme }) => `color: ${theme.colors.primary.red[0]};`}
  padding: 5px;
`;

const DateText = styled.Text<{ size: "large" | "small"; theme: ThemeType }>`
  font-size: ${({ size, theme }) =>
    size === "large" ? theme.fontSizes[6] : theme.fontSizes[5]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  padding: 5px;
`;

const TimeText = styled.Text<{ size: "large" | "small"; theme: ThemeType }>`
  font-size: ${({ size, theme }) =>
    size === "large" ? theme.fontSizes[4] : theme.fontSizes[3]}px;
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding: 5px;
`;

export { Container, TitleText, DateText, TimeText };

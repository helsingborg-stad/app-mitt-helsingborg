import styled from "styled-components/native";
import { ThemeType } from "../../../styles/themeHelpers";

interface ButtonProps {
  selected: boolean;
  theme: ThemeType;
}
const ButtonContainer = styled.TouchableHighlight<ButtonProps>`
  padding: 12px 20px;
  margin: 0;
  width: ${({ selected }) => (selected ? "172px" : "150px")};
  height: 48px;
  background: ${({ theme, selected }) =>
    selected ? theme.colors.primary.red[1] : theme.colors.neutrals[5]};
  border-radius: 4.5px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ selected }) => (selected ? "space-between" : "center")};
  align-items: center;
`;

interface TimeTextProps {
  selected: boolean;
  theme: ThemeType;
}
const TimeText = styled.Text<TimeTextProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.colors.neutrals[7] : theme.colors.neutrals[0]};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 0;
  margin: 0;
`;

export { ButtonContainer, TimeText };
